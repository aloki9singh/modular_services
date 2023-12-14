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
const _mongoose = require("mongoose");
const otpSchema = new _mongoose.Schema({
    identifier: String,
    passwords: [
        {
            code: {
                type: Number
            },
            expiresAt: {
                type: Date
            },
            verified: {
                type: Boolean,
                default: false
            },
            requestedAt: {
                type: Date,
                default: Date.now
            },
            serviceProvider: {
                type: String
            },
            serviceProviderResponse: {
                type: _mongoose.Schema.Types.Mixed
            }
        }
    ],
    failedAttempts: {
        type: Number,
        default: 0
    },
    lockoutUntil: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});
const OtpModel = (0, _mongoose.model)("OTP", otpSchema);
const _default = OtpModel;

//# sourceMappingURL=otp.model.js.map