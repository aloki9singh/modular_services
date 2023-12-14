"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    check_expire: function() {
        return check_expire;
    },
    isExpired: function() {
        return isExpired;
    }
});
const _urlmodel = _interop_require_default(require("../models/url.model"));
const _validator = _interop_require_default(require("validator"));
const _url = require("../services/url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const isExpired = async (req, res, next)=>{
    try {
        const shortId = req.params.shortId;
        const url = await _urlmodel.default.findOne({
            short_id: shortId
        });
        if (!url) {
            res.status(404).json({
                error: "URL not found"
            });
            return;
        }
        if (url.status === "expired" || url.expiration_date && new Date() > new Date(url.expiration_date)) {
            url.status = "expired";
            await url.save();
            res.status(400).json({
                error: "URL has expired"
            });
            return;
        }
        next();
    } catch (error) {
        console.error("Error checking URL expiration:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};
const check_expire = async (req, res, next)=>{
    const DOMAIN = process.env.CORS_ORIGINS;
    const { original_url } = req.body;
    try {
        if (!_validator.default.isURL(original_url)) {
            res.status(400).json({
                error: "Invalid URL format"
            });
            return;
        }
        const existing_url = await (0, _url.findExistingURL)(original_url);
        if (existing_url) {
            if (existing_url.status === "expired" || existing_url.expiration_date && new Date() > new Date(existing_url.expiration_date)) {
                existing_url.expiration_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                existing_url.status = "active";
                await existing_url.save();
                res.json({
                    short_url: existing_url.short_url,
                    short_id: existing_url.short_id
                });
                return;
            }
            res.json({
                short_url: existing_url.short_url,
                short_id: existing_url.short_id
            });
            return;
        }
        next();
    } catch (error) {
        console.log("error while checking original url existance", error);
        res.status(500).send("Internal server error");
    }
};

//# sourceMappingURL=url.js.map