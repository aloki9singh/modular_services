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
const _expressratelimit = _interop_require_default(require("express-rate-limit"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const otpLimiter = (0, _expressratelimit.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Rate limit exceeded. Please try again later."
    }
});
const otpMiddleware = (req, res, next)=>{
    otpLimiter(req, res, (err)=>{
        if (err) {
            return res.status(429).json({
                success: false,
                error: err.message
            });
        } else {
            next();
        }
    });
};
const _default = otpMiddleware;

//# sourceMappingURL=otp.js.map