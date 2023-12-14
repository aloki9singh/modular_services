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
const _logcontroller = _interop_require_default(require("../controllers/log.controller"));
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
let LogRoute = class LogRoute {
    initializeRoutes() {
        this.router.get(`${this.path}/:short_id`, this.logController.getURLAnalytics);
        this.router.get(`${this.path}/visitors/:short_id`, this.logController.getAllVisitors);
    }
    constructor(){
        _define_property(this, "path", '/log');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "logController", new _logcontroller.default());
        this.initializeRoutes();
    }
};
const _default = LogRoute;

//# sourceMappingURL=log.route.js.map