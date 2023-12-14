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
const _otpmodel = _interop_require_default(require("../models/otp.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const cleanupDatabase = async ()=>{
    try {
        const result = await _otpmodel.default.updateMany({
            "passwords.expiresAt": {
                $lt: new Date()
            }
        }, {
            $pull: {
                passwords: {
                    expiresAt: {
                        $lt: new Date()
                    }
                }
            }
        }, {
            multi: true
        });
    } catch (error) {
        console.error("Error during database cleanup:", error);
    }
};
const _default = cleanupDatabase;

//# sourceMappingURL=otpCleaner.js.map