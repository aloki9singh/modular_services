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
const urlSchema = new _mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_id: {
        type: String,
        required: true,
        unique: true
    },
    short_url: {
        type: String,
        required: true
    },
    expiration_date: {
        type: Date
    },
    starting_date: {
        type: Date,
        default: Date.now()
    },
    app_id: {
        type: _mongoose.Types.ObjectId
    },
    title: String,
    description: String,
    status: {
        type: String,
        enum: [
            'active',
            'expired',
            'draft'
        ],
        default: 'active'
    },
    stats: {
        total_visitor: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});
const UrlModel = (0, _mongoose.model)('urls', urlSchema);
const _default = UrlModel;

//# sourceMappingURL=url.model.js.map