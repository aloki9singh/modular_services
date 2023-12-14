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
const _healthCheckcontroller = _interop_require_default(require("../controllers/healthCheck.controller"));
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
let HealthCheckRoute = class HealthCheckRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.healthCheckController.get);
    }
    constructor(){
        _define_property(this, "path", '/health-check');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "healthCheckController", new _healthCheckcontroller.default());
        this.initializeRoutes();
    }
};
const _default = HealthCheckRoute;

//# sourceMappingURL=health-check.js.map