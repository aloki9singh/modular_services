"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthenticationMiddleware", {
    enumerable: true,
    get: function() {
        return AuthenticationMiddleware;
    }
});
const _authcontroller = _interop_require_default(require("../controllers/auth.controller"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let AuthenticationMiddleware = class AuthenticationMiddleware {
    static isAuthenticated(req, res, next) {
        if (!_authcontroller.default.tokenn) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        next();
    }
};

//# sourceMappingURL=AuthenticationMiddleware.js.map