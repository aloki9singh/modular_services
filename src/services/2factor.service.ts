import axios from "axios";

class TwoFactorService {
	private readonly apiKey: string;

	constructor() {
		this.apiKey = process.env.TWOFACTOR_API_KEY || "random key";

		if (!this.apiKey) {
			throw new Error("2FACTOR API key not provided.");
		}
	}

	async sendOTP(identifier: string, otp: number): Promise<any> {
		try {
			const response = await axios.post(
				`https://2factor.in/API/V1/${this.apiKey}/SMS/+91${identifier}/${otp}`,
				{},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			return {
				success: true,
				message: "OTP sent successfully",
				response: response.data,
			};
		} catch (error) {
			throw new Error(
				`Failed to send OTP with 2FACTOR: ${error.message}`,
			);
		}
	}
}

export default TwoFactorService;
