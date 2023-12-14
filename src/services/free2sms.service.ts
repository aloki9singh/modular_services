import axios from "axios";

class Free2SMSService {
	private readonly apiKey: string;

	constructor() {
		this.apiKey = process.env.FREE2SMS_API_KEY || "random key";

		if (!this.apiKey) {
			throw new Error("Free2SMS API key not provided.");
		}
	}

	async sendOTP(identifier: string, otp: number): Promise<any> {
		try {
			const response = await axios.get(
				`https://www.sms4india.com/api/v1/sendCampaign?apikey=${this.apiKey}&secret={API_SECRET}&usetype={type}&phone=+91${identifier}&message=Your OTP is: ${otp}&senderid={senderid}`,
			);

			return {
				success: true,
				message: "OTP sent successfully",
				response: response.data,
			};
		} catch (error) {
			throw new Error(
				`Failed to send OTP with Free2SMS: ${error.message}`,
			);
		}
	}
}

export default Free2SMSService;
