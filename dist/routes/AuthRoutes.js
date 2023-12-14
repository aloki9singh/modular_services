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
const _express = require("express");
const _authcontroller = require("../controllers/auth.controller");
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
let AuthRoutes = class AuthRoutes {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authcontroller.AuthController.authenticateUser);
        this.router.get(`${this.path}google/redirect`, _authcontroller.AuthController.handleOAuthCallback);
    }
    constructor(){
        _define_property(this, "path", "/");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "authController", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};
const _default = AuthRoutes;

//# sourceMappingURL=AuthRoutes.js.map