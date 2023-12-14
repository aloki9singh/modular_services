import twilio from "twilio";
import OtpModel from "../models/otp.model";
import {OtpDocument} from "../interfaces/otp.interface";

class OtpService {
	private readonly client: twilio.Twilio;
	private readonly MAX_FAILED_ATTEMPTS = 5;
	private readonly LOCKOUT_DURATION_MINUTES = 15;

	constructor() {
		const accountSid: string = process.env.TWILIO_ACCOUNT_SID || "";
		const authToken: string = process.env.TWILIO_AUTH_TOKEN || "";

		if (!accountSid || !authToken) {
			const errorMessage = "Twilio credentials not provided.";
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		try {
			this.client = twilio(accountSid, authToken);
		} catch (error) {
			const errorMessage = "Failed to initialize Twilio client.";
			console.error(`${errorMessage} ${error}`);
			throw new Error(errorMessage);
		}
	}

	public generateOtp = async (identifier: string): Promise<any> => {
		// Implementation for generating OTP

		// Example implementation:
		const otp = Math.floor(100000 + Math.random() * 900000);

		// Example implementation for sending OTP via Twilio
		const message = await this.client.messages.create({
			body: `Your OTP is: ${otp}`,
			to: `+91${identifier}`,
			from: process.env.TWILIO_MOBILE || "",
		});

		// Example implementation for saving OTP to the database
		// Modify this based on your actual database model and structure
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

		console.log("OTP sent successfully:", message.sid);

		return {
			message: "OTP sent successfully",
			otpSid: message.sid,
			success: true,
			statusCode: 200,
		};
	};

	// Method to verify the user-entered OTP
	public verifyOtp = async (
		identifier: string,
		userEnteredOTP: number,
	): Promise<any> => {
		// Implementation for verifying OTP

		// Example implementation:
		const otpRecord: OtpDocument | null = await OtpModel.findOne({
			identifier,
		});

		// Example implementation for handling OTP verification
		// Modify this based on your actual verification logic
		if (
			!otpRecord ||
			!otpRecord.passwords ||
			otpRecord.passwords.length === 0
		) {
			return {
				success: false,
				error: "OTP not found",
				message: "Please generate a new OTP.",
				statusCode: 404,
			};
		}

		// Check if the user is locked out due to too many failed attempts
		if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
			const lockoutEndTime = new Date(otpRecord.lockoutUntil || "");

			if (lockoutEndTime > new Date()) {
				const remainingLockoutTime = Math.ceil(
					(lockoutEndTime.getTime() - new Date().getTime()) /
					(this.LOCKOUT_DURATION_MINUTES * 60 * 1000),
				);

				return {
					success: false,
					error: "Account locked",
					message: `Too many failed attempts. Try again after ${remainingLockoutTime} minutes.`,
					statusCode: 403,
				};
			} else {
				otpRecord.failedAttempts = 0;
				otpRecord.lockoutUntil = null;
			}
		}

		const latestOTP = otpRecord.passwords.slice(-1)[0];

		if (latestOTP.verified) {
			return {
				success: false,
				error: "Invalid OTP",
				message: "This OTP has already been used.",
				statusCode: 400,
			};
		}

		const expirationTime = new Date(
			latestOTP.expiresAt.getTime() +
			this.LOCKOUT_DURATION_MINUTES * 60 * 1000,
		);

		if (expirationTime < new Date()) {
			return {
				success: false,
				error: "OTP expired",
				message: "Please generate a new OTP.",
				statusCode: 400,
			};
		}

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
			return {
				success: true,
				message: "OTP verified successfully",
				statusCode: 200,
			};
		} else {
			const response = {
				success: false,
				error: "Invalid OTP",
				message: "Please enter a valid OTP.",
				lockout: null as { until: Date; remainingTime: number } | null,
				statusCode: 400,
			};

			if (otpRecord.lockoutUntil) {
				const remainingLockoutTime = Math.ceil(
					(otpRecord.lockoutUntil.getTime() - new Date().getTime()) /
					(60 * 1000),
				);
				response.lockout = {
					until: otpRecord.lockoutUntil,
					remainingTime: remainingLockoutTime,
				};
			}

			return response;
		}
	};
}

export default OtpService;
