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
const _twilioservice = _interop_require_default(require("./twilio.service"));
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
let ServiceProviderManager = class ServiceProviderManager {
    static getProviders() {
        return this.providers;
    }
    static async switchProvider() {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
        return this.providers[this.currentProviderIndex];
    }
};
_define_property(ServiceProviderManager, "providers", [
    {
        name: "Twilio",
        instance: new _twilioservice.default()
    }
]);
_define_property(ServiceProviderManager, "currentProviderIndex", 0);
const _default = ServiceProviderManager;

//# sourceMappingURL=service-provider.manager.js.map