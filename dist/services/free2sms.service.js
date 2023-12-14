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
const _axios = _interop_require_default(require("axios"));
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
let Free2SMSService = class Free2SMSService {
    async sendOTP(identifier, otp) {
        try {
            const response = await _axios.default.get(`https://www.sms4india.com/api/v1/sendCampaign?apikey=${this.apiKey}&secret={API_SECRET}&usetype={type}&phone=+91${identifier}&message=Your OTP is: ${otp}&senderid={senderid}`);
            return {
                success: true,
                message: "OTP sent successfully",
                response: response.data
            };
        } catch (error) {
            throw new Error(`Failed to send OTP with Free2SMS: ${error.message}`);
        }
    }
    constructor(){
        _define_property(this, "apiKey", void 0);
        this.apiKey = process.env.FREE2SMS_API_KEY || "random key";
        if (!this.apiKey) {
            throw new Error("Free2SMS API key not provided.");
        }
    }
};
const _default = Free2SMSService;

//# sourceMappingURL=free2sms.service.js.map