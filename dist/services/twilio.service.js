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
let TwilioService = class TwilioService {
    async sendOTP(identifier, otp) {
        try {
            const message = await this.client.messages.create({
                body: `Your OTP is: ${otp}`,
                to: `+91${identifier}`,
                from: process.env.TWILIO_MOBILE || ""
            });
            return {
                success: true,
                message: "OTP sent successfully",
                response: message
            };
        } catch (error) {
            throw new Error(`Failed to send OTP with Twilio: ${error.message}`);
        }
    }
    constructor(){
        _define_property(this, "client", void 0);
        const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
        const authToken = process.env.TWILIO_AUTH_TOKEN || "";
        if (!accountSid || !authToken) {
            throw new Error("Twilio credentials not provided.");
        }
        this.client = (0, _twilio.default)(accountSid, authToken);
    }
};
const _default = TwilioService;

//# sourceMappingURL=twilio.service.js.map