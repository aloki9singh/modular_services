import { OtpDocument } from "@interfaces/otp.interface";
import { Schema, model, Document } from "mongoose";

const otpSchema = new Schema<OtpDocument>(
	{
		identifier: String,
		passwords: [
			{
				code: { type: Number },
				expiresAt: { type: Date },
				verified: { type: Boolean, default: false },
				requestedAt: { type: Date, default: Date.now },
				serviceProvider: { type: String },
				serviceProviderResponse: { type: Schema.Types.Mixed },
			},
		],
		failedAttempts: { type: Number, default: 0 },
		lockoutUntil: { type: Date, default: null },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const OtpModel = model<OtpDocument>("OTP", otpSchema);

export default OtpModel;
