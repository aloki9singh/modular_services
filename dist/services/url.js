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
    createNewURL: function() {
        return createNewURL;
    },
    findExistingURL: function() {
        return findExistingURL;
    },
    generateUniqueShortID: function() {
        return generateUniqueShortID;
    },
    getExpirationDate: function() {
        return getExpirationDate;
    }
});
const _urlmodel = _interop_require_default(require("../models/url.model"));
const _uuid = require("uuid");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const findExistingURL = async (original_url)=>{
    return await _urlmodel.default.findOne({
        original_url
    });
};
const generateUniqueShortID = ()=>{
    const uuid = (0, _uuid.v4)();
    const base64 = Buffer.from(uuid).toString("base64");
    const shortID = base64.replace(/[+/=-_*&^%$#@!`~:;"',|<.>?]/g, "").substring(0, 6);
    return shortID;
};
const getExpirationDate = (expiration_date)=>{
    if (expiration_date) {
        const date = new Date(expiration_date);
        date.setHours(23, 59, 59, 999);
        return date;
    }
    return null;
};
const createNewURL = (original_url, short_id, expirationDate, title, description)=>{
    const isExpired = expirationDate && new Date(expirationDate) < new Date();
    const SHORT_URL_DOMAIN = process.env.SHORT_URL_DOMAIN;
    const short_url = `${SHORT_URL_DOMAIN}/${short_id}`;
    return new _urlmodel.default({
        original_url,
        short_id,
        short_url,
        starting_date: Date.now(),
        expiration_date: isExpired ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : expirationDate ? new Date(expirationDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        title,
        description,
        status: isExpired ? "expired" : "active"
    });
};

//# sourceMappingURL=url.js.map