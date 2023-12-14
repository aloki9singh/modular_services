"use strict";
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
let ApiFeatures = class ApiFeatures {
    constructor(query, queryStr){
        _define_property(this, "queryStr", void 0);
        _define_property(this, "query", void 0);
        this.query = query;
        this.queryStr = queryStr;
    }
};
module.exports = ApiFeatures;

//# sourceMappingURL=apiFeatures.js.map