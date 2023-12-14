"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _twilio = _interop_require_default(require("twilio"));
const _otpmodel = _interop_require_default(require("../models/otp.model"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let OtpService = class OtpService {
    constructor(){
        _define_property(this, "client", void 0);
        _define_property(this, "MAX_FAILED_ATTEMPTS", 5);
        _define_property(this, "LOCKOUT_DURATION_MINUTES", 15);
        _define_property(this, "generateOtp", async (identifier)=>{
            const otp = Math.floor(100000 + Math.random() * 900000);
            const message = await this.client.messages.create({
                body: `Your OTP is: ${otp}`,
                to: `+91${identifier}`,
                from: process.env.TWILIO_MOBILE || ""
            });
            const otpRecord = await _otpmodel.default.findOne({
                identifier
            });
            if (otpRecord) {
                otpRecord.passwords.push({
                    code: otp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    verified: false,
                    requestedAt: new Date(),
                    serviceProvider: "",
                    serviceProviderResponse: undefined
                });
                otpRecord.failedAttempts = 0;
                await otpRecord.save();
            } else {
                const sendOTP = new _otpmodel.default({
                    identifier,
                    passwords: [
                        {
                            code: otp,
                            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                        }
                    ],
                    failedAttempts: 0
                });
                await sendOTP.save();
            }
            console.log("OTP sent successfully:", message.sid);
            return {
                message: "OTP sent successfully",
                otpSid: message.sid,
                success: true,
                statusCode: 200
            };
        });
        _define_property(this, "verifyOtp", async (identifier, userEnteredOTP)=>{
            const otpRecord = await _otpmodel.default.findOne({
                identifier
            });
            if (!otpRecord || !otpRecord.passwords || otpRecord.passwords.length === 0) {
                return {
                    success: false,
                    error: "OTP not found",
                    message: "Please generate a new OTP.",
                    statusCode: 404
                };
            }
            if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
                const lockoutEndTime = new Date(otpRecord.lockoutUntil || "");
                if (lockoutEndTime > new Date()) {
                    const remainingLockoutTime = Math.ceil((lockoutEndTime.getTime() - new Date().getTime()) / (this.LOCKOUT_DURATION_MINUTES * 60 * 1000));
                    return {
                        success: false,
                        error: "Account locked",
                        message: `Too many failed attempts. Try again after ${remainingLockoutTime} minutes.`,
                        statusCode: 403
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
                    statusCode: 400
                };
            }
            const expirationTime = new Date(latestOTP.expiresAt.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
            if (expirationTime < new Date()) {
                return {
                    success: false,
                    error: "OTP expired",
                    message: "Please generate a new OTP.",
                    statusCode: 400
                };
            }
            if (latestOTP.code === userEnteredOTP) {
                latestOTP.verified = true;
                otpRecord.failedAttempts = 0;
                otpRecord.lockoutUntil = null;
            } else {
                otpRecord.failedAttempts += 1;
                if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
                    otpRecord.lockoutUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
                }
            }
            await otpRecord.save();
            if (latestOTP.verified) {
                return {
                    success: true,
                    message: "OTP verified successfully",
                    statusCode: 200
                };
            } else {
                const response = {
                    success: false,
                    error: "Invalid OTP",
                    message: "Please enter a valid OTP.",
                    lockout: null,
                    statusCode: 400
                };
                if (otpRecord.lockoutUntil) {
                    const remainingLockoutTime = Math.ceil((otpRecord.lockoutUntil.getTime() - new Date().getTime()) / (60 * 1000));
                    response.lockout = {
                        until: otpRecord.lockoutUntil,
                        remainingTime: remainingLockoutTime
                    };
                }
                return response;
            }
        });
        const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
        const authToken = process.env.TWILIO_AUTH_TOKEN || "";
        if (!accountSid || !authToken) {
            const errorMessage = "Twilio credentials not provided.";
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        try {
            this.client = (0, _twilio.default)(accountSid, authToken);
        } catch (error) {
            const errorMessage = "Failed to initialize Twilio client.";
            console.error(`${errorMessage} ${error}`);
            throw new Error(errorMessage);
        }
    }
};
const _default = OtpService;

//# sourceMappingURL=otpService.js.map