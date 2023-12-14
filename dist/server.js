"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _healthcheck = _interop_require_default(require("./routes/health-check"));
const _app = _interop_require_default(require("./@app"));
const _authroute = _interop_require_default(require("./routes/admin/auth.route"));
const _urlroute = _interop_require_default(require("./routes/url.route"));
const _logroute = _interop_require_default(require("./routes/log.route"));
const _EventRoutes = _interop_require_default(require("./routes/EventRoutes"));
const _AuthRoutes = _interop_require_default(require("./routes/AuthRoutes"));
const _otproute = _interop_require_default(require("./routes/otp.route"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const app = new _app.default([
    new _AuthRoutes.default(),
    new _EventRoutes.default(),
    new _authroute.default(),
    new _healthcheck.default(),
    new _logroute.default(),
    new _urlroute.default(),
    new _otproute.default()
]);
app.listen();

//# sourceMappingURL=server.js.map