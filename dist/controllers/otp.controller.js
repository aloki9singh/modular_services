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
const _otpmodel = _interop_require_default(require("../models/otp.model"));
const _serviceprovidermanager = _interop_require_default(require("../services/service-provider.manager"));
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
let OtpController = class OtpController {
    handleErrorResponse(res, error, methodName) {
        const logMessage = `Error in ${methodName}:`;
        if (error instanceof Error) {
            console.error(`${logMessage} ${error.message}`);
            res.status(500).send({
                success: false,
                error: "Internal server error",
                message: error.message
            });
        } else {
            console.error(`${logMessage} An unknown error occurred.`);
            res.status(500).send({
                success: false,
                error: "Internal server error",
                message: "An unknown error occurred"
            });
        }
    }
    constructor(){
        _define_property(this, "MAX_FAILED_ATTEMPTS", 5);
        _define_property(this, "LOCKOUT_DURATION_MINUTES", 15);
        _define_property(this, "generateOtp", async (req, res)=>{
            try {
                const { identifier } = req.body;
                const lockedUser = await _otpmodel.default.findOne({
                    identifier,
                    lockoutUntil: {
                        $gt: new Date()
                    }
                });
                if (lockedUser && lockedUser.lockoutUntil) {
                    const lockoutRemainingMinutes = Math.ceil((lockedUser.lockoutUntil.getTime() - new Date().getTime()) / (60 * 1000));
                    return res.status(400).send({
                        success: false,
                        error: "Verification Limit Exceeded",
                        message: `You have exceeded the maximum verification attempts. Please try again after ${lockoutRemainingMinutes} minutes.`
                    });
                }
                const otp = Math.floor(100000 + Math.random() * 900000);
                const providers = _serviceprovidermanager.default.getProviders();
                let success = false;
                let serviceProviderResponse;
                for (const currentProvider of providers){
                    try {
                        serviceProviderResponse = await currentProvider.instance.sendOTP(identifier, otp);
                        success = true;
                        break;
                    } catch (error) {
                        console.error(`Failed to send OTP with ${currentProvider.name}: ${error.message}`);
                    }
                }
                if (!success) {
                    const nextProvider = await _serviceprovidermanager.default.switchProvider();
                    serviceProviderResponse = await nextProvider.instance.sendOTP(identifier, otp);
                }
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
                res.status(200).send({
                    message: "OTP sent successfully",
                    success: true
                });
            } catch (error) {
                this.handleErrorResponse(res, error, "generateOtp service provider Key Error");
            }
            return res;
        });
        _define_property(this, "verifyOtp", async (req, res)=>{
            try {
                const { identifier, userEnteredOTP } = req.body;
                const otpRecord = await _otpmodel.default.findOne({
                    identifier
                });
                if (!otpRecord || !otpRecord.passwords || otpRecord.passwords.length === 0) {
                    return res.status(404).send({
                        success: false,
                        error: "OTP not found",
                        message: "Please generate a new OTP."
                    });
                }
                if (otpRecord.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
                    const lockoutEndTime = new Date(otpRecord.lockoutUntil || "");
                    if (lockoutEndTime > new Date()) {
                        const remainingLockoutTime = Math.ceil((lockoutEndTime.getTime() - new Date().getTime()) / (this.LOCKOUT_DURATION_MINUTES * 60 * 1000));
                        return res.status(403).send({
                            success: false,
                            error: "Account locked",
                            message: `Too many failed attempts. Try again after ${remainingLockoutTime} minutes.`
                        });
                    } else {
                        otpRecord.failedAttempts = 0;
                        otpRecord.lockoutUntil = null;
                    }
                }
                const latestOTP = otpRecord.passwords.slice(-1)[0];
                if (latestOTP.verified) {
                    return res.status(400).send({
                        success: false,
                        error: "Invalid OTP",
                        message: "This OTP has already been used."
                    });
                }
                const expirationTime = new Date(latestOTP.expiresAt.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
                if (expirationTime < new Date()) {
                    return res.status(400).send({
                        success: false,
                        error: "OTP expired",
                        message: "Please generate a new OTP."
                    });
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
                    return res.status(200).send({
                        success: true,
                        message: "OTP verified successfully"
                    });
                } else {
                    const response = {
                        success: false,
                        error: "Invalid OTP",
                        message: "Please enter a valid OTP.",
                        lockout: null
                    };
                    if (otpRecord.lockoutUntil) {
                        const remainingLockoutTime = Math.ceil((otpRecord.lockoutUntil.getTime() - new Date().getTime()) / (60 * 1000));
                        response.lockout = {
                            until: otpRecord.lockoutUntil,
                            remainingTime: remainingLockoutTime
                        };
                    }
                    return res.status(400).send(response);
                }
            } catch (error) {
                this.handleErrorResponse(res, error, "verifyOtp");
            }
            return res;
        });
    }
};
const _default = OtpController;

//# sourceMappingURL=otp.controller.js.map