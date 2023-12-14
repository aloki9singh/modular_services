
import twilio from "twilio";

class TwilioService {
  private readonly client: twilio.Twilio;

  constructor() {
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID || "";
    const authToken: string = process.env.TWILIO_AUTH_TOKEN || "";

    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not provided.");
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendOTP(identifier: string, otp: number): Promise<any> {
    try {
      const message = await this.client.messages.create({
        body: `Your OTP is: ${otp}`,
        to: `+91${identifier}`,
        from: process.env.TWILIO_MOBILE || "",
      });

      return {
        success: true,
        message: "OTP sent successfully",
        response: message,
      };
    } catch (error) {
      throw new Error(`Failed to send OTP with Twilio: ${error.message}`);
    }
  }
}

export default TwilioService;
