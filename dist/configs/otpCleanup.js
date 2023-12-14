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
const _nodecron = _interop_require_default(require("node-cron"));
const _otpCleaner = _interop_require_default(require("../utils/otpCleaner"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const databaseCleaner = ()=>{
    _nodecron.default.schedule('0 3 * * *', async ()=>{
        console.log('Running database cleanup...');
        await (0, _otpCleaner.default)();
    });
};
const _default = databaseCleaner;

//# sourceMappingURL=otpCleanup.js.map