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
const _authcontroller = _interop_require_default(require("../../controllers/auth.controller"));
const _auth = require("../../middlewares/auth");
const _express = require("express");
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
let AuthRoute = class AuthRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/signin`, this.authController.login);
        this.router.get(`${this.path}/signout`, this.authController.signout);
        this.router.get(`${this.path}/me`, _auth.ensureAdminAuth);
        this.router.post(`${this.path}/register`);
    }
    constructor(){
        _define_property(this, "path", '/admin/auth');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "authController", new _authcontroller.default());
        this.initializeRoutes();
    }
};
const _default = AuthRoute;

//# sourceMappingURL=auth.route.js.map