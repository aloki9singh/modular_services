import { Request, Response } from "express";
import OtpModel from "../models/otp.model";
import { OtpDocument } from "@interfaces/otp.interface";
import ServiceProviderManager from "../services/service-provider.manager";

class OtpController {

	private readonly MAX_FAILED_ATTEMPTS = 5;
	private readonly LOCKOUT_DURATION_MINUTES = 15;

	
	// Method to generate and send OTP
	public generateOtp = async (
		req: Request,
		res: Response,
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const { identifier } = req.body;
			// Check if the user is locked out due to too many failed attempts
			const lockedUser: OtpDocument | null = await OtpModel.findOne({
				identifier,
				lockoutUntil: { $gt: new Date() },
			});

			if (lockedUser && lockedUser.lockoutUntil) {
				const lockoutRemainingMinutes = Math.ceil(
					(lockedUser.lockoutUntil.getTime() - new Date().getTime()) /
						(60 * 1000),
				);

				return res.status(400).send({
					success: false,
					error: "Verification Limit Exceeded",
					message: `You have exceeded the maximum verification attempts. Please try again after ${lockoutRemainingMinutes} minutes.`,
				});
			}
			// Generate a random OTP
			const otp = Math.floor(100000 + Math.random() * 900000);


			const providers = ServiceProviderManager.getProviders();

      let success = false;
      let serviceProviderResponse: any;

      for (const currentProvider of providers) {
        try {
          serviceProviderResponse = await currentProvider.instance.sendOTP(
            identifier,
            otp
          );
          success = true;
          break;
        } catch (error) {
          console.error(
            `Failed to send OTP with ${currentProvider.name}: ${error.message}`
          );
        }
      }

      if (!success) {
        const nextProvider = await ServiceProviderManager.switchProvider();
        serviceProviderResponse = await nextProvider.instance.sendOTP(
          identifier,
          otp
        );
      }

			const otpRecord: OtpDocument | null = await OtpModel.findOne({
				identifier,
			});

			if (otpRecord) {
				// Update existing OTP record
				otpRecord.passwords.push({
					code: otp,
					expiresAt: new Date(Date.now() + 5 * 60 * 1000),
					verified: false,
					requestedAt: new Date(),
					serviceProvider: "",
					serviceProviderResponse: undefined,
				});
				otpRecord.failedAttempts = 0;
				await otpRecord.save();
			} else {
				// Create a new OTP record for the user
				const sendOTP = new OtpModel({
					identifier,
					passwords: [
						{
							code: otp,
							expiresAt: new Date(Date.now() + 5 * 60 * 1000),
						},
					],
					failedAttempts: 0,
				});
				await sendOTP.save();
			}

			res.status(200).send({
				message: "OTP sent successfully",
				success: true,
			});
		} catch (error: unknown) {
			this.handleErrorResponse(
				res,
				error,
				"generateOtp service provider Key Error",
			);
		}

		return res;
	};

	// Method to verify the user-entered OTP
	public verifyOtp = async (
		req: Request,
		res: Response,
	): Promise<Response<any, Record<string, any>>> => {
		try {
			const { identifier, userEnteredOTP } = req.body;

			const otpRecord: OtpDocument | null = await OtpModel.findOne({
				identifier,
			});
			// Check if the OTP record exists and contains passwords
			if (
				!otpRecord ||
				!otpRecord.passwords ||
				otpRecord.passwords.length === 0
			) {
				return res.status(404).send({
					success: false,
					error: "OTP not found",
					message: "Please generate a new OTP.",
				});
			}
			// Check if the user is locked out due to too many failed attempts
			if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
				const lockoutEndTime = new Date(otpRecord.lockoutUntil || "");

				if (lockoutEndTime > new Date()) {
					const remainingLockoutTime = Math.ceil(
						(lockoutEndTime.getTime() - new Date().getTime()) /
							(this.LOCKOUT_DURATION_MINUTES * 60 * 1000),
					);

					return res.status(403).send({
						success: false,
						error: "Account locked",
						message: `Too many failed attempts. Try again after ${remainingLockoutTime} minutes.`,
					});
				} else {
					otpRecord.failedAttempts = 0;
					otpRecord.lockoutUntil = null;
				}
			}
			// Get the latest OTP from the record in descending order
			const latestOTP = otpRecord.passwords.slice(-1)[0];
			// Check if the latest OTP has already been verified
			if (latestOTP.verified) {
				return res.status(400).send({
					success: false,
					error: "Invalid OTP",
					message: "This OTP has already been used.",
				});
			}

			const expirationTime = new Date(
				latestOTP.expiresAt.getTime() +
					this.LOCKOUT_DURATION_MINUTES * 60 * 1000,
			);

			if (expirationTime < new Date()) {
				return res.status(400).send({
					success: false,
					error: "OTP expired",
					message: "Please generate a new OTP.",
				});
			}
			// Verify the user-entered OTP
			if (latestOTP.code === userEnteredOTP) {
				latestOTP.verified = true;
				otpRecord.failedAttempts = 0;
				otpRecord.lockoutUntil = null;
			} else {
				otpRecord.failedAttempts += 1;

				if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
					otpRecord.lockoutUntil = new Date(
						Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000,
					);
				}
			}

			await otpRecord.save();

			if (latestOTP.verified) {
				return res.status(200).send({
					success: true,
					message: "OTP verified successfully",
				});
			} else {
				const response: {
					success: false;
					error: "Invalid OTP";
					message: "Please enter a valid OTP.";
					lockout: { until: Date; remainingTime: number } | null;
				} = {
					success: false,
					error: "Invalid OTP",
					message: "Please enter a valid OTP.",
					lockout: null,
				};

				// Include lockout information in the response if applicable
				if (otpRecord.lockoutUntil) {
					const remainingLockoutTime = Math.ceil(
						(otpRecord.lockoutUntil.getTime() -
							new Date().getTime()) /
							(60 * 1000),
					);
					response.lockout = {
						until: otpRecord.lockoutUntil,
						remainingTime: remainingLockoutTime,
					};
				}

				return res.status(400).send(response);
			}
		} catch (error: unknown) {
			this.handleErrorResponse(res, error, "verifyOtp");
		}

		return res;
	};

	private handleErrorResponse(
		res: Response,
		error: unknown,
		methodName: string,
	): void {
		const logMessage = `Error in ${methodName}:`;

		if (error instanceof Error) {
			console.error(`${logMessage} ${error.message}`);
			res.status(500).send({
				success: false,
				error: "Internal server error",
				message: error.message,
			});
		} else {
			console.error(`${logMessage} An unknown error occurred.`);
			res.status(500).send({
				success: false,
				error: "Internal server error",
				message: "An unknown error occurred",
			});
		}
	}
}

export default OtpController;
