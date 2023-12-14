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
let TwoFactorService = class TwoFactorService {
    async sendOTP(identifier, otp) {
        try {
            const response = await _axios.default.post(`https://2factor.in/API/V1/${this.apiKey}/SMS/+91${identifier}/${otp}`, {}, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return {
                success: true,
                message: "OTP sent successfully",
                response: response.data
            };
        } catch (error) {
            throw new Error(`Failed to send OTP with 2FACTOR: ${error.message}`);
        }
    }
    constructor(){
        _define_property(this, "apiKey", void 0);
        this.apiKey = process.env.TWOFACTOR_API_KEY || "random key";
        if (!this.apiKey) {
            throw new Error("2FACTOR API key not provided.");
        }
    }
};
const _default = TwoFactorService;

//# sourceMappingURL=2factor.service.js.map