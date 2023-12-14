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
const _url = require("../middlewares/url");
const _urlcontroller = _interop_require_default(require("../controllers/url.controller"));
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
let UrlRoute = class UrlRoute {
    initializeRoutes() {
        this.router.post(`${this.path}short`, _url.check_expire, this.urlController.shortenURL);
        this.router.get(`${this.path}appid`, this.urlController.getShortUrlsByAppId);
        this.router.delete(`${this.path}delete/:shortId`, this.urlController.deleteShortUrl);
        this.router.put(`${this.path}update/:shortId`, this.urlController.updateURL);
        this.router.get(`${this.path}:shortId`, _url.isExpired, this.urlController.redirectToOriginalURL);
    }
    constructor(){
        _define_property(this, "router", _express.default.Router());
        _define_property(this, "path", "/");
        _define_property(this, "urlController", new _urlcontroller.default());
        this.initializeRoutes();
    }
};
const _default = UrlRoute;

//# sourceMappingURL=url.route.js.map