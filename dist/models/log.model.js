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
const logSchema = new _mongoose.Schema({
    url_id: {
        type: _mongoose.Types.ObjectId,
        ref: 'urls'
    },
    ip_address: {
        type: String,
        required: true
    },
    visit_time: {
        type: Date
    },
    referrer: {
        type: String
    }
});
const LogModel = (0, _mongoose.model)('logs', logSchema);
const _default = LogModel;

//# sourceMappingURL=log.model.js.map