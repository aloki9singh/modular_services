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
const _express = _interop_require_default(require("express"));
const _otpcontroller = _interop_require_default(require("../controllers/otp.controller"));
const _otp = _interop_require_default(require("../middlewares/otp"));
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
let OtpRoute = class OtpRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/generate`, _otp.default, this.otpController.generateOtp);
        this.router.post(`${this.path}/verify`, this.otpController.verifyOtp);
    }
    constructor(){
        _define_property(this, "path", '/api/otp');
        _define_property(this, "router", _express.default.Router());
        _define_property(this, "otpController", new _otpcontroller.default());
        this.initializeRoutes();
    }
};
const _default = OtpRoute;

//# sourceMappingURL=otp.route.js.map