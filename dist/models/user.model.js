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
const _mongoose = require("mongoose");
const userSchema = new _mongoose.Schema({
    password: String
}, {
    timestamps: true
});
const UserModel = (0, _mongoose.model)('User', userSchema);
const _default = UserModel;

//# sourceMappingURL=user.model.js.map