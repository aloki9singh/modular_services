"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getAssessments", {
    enumerable: true,
    get: function() {
        return getAssessments;
    }
});
const _axios = _interop_require_default(require("axios"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function getAssessments() {
    const res = await _axios.default.get(`${process.env.ASSESSMENT_SERVICE_URL}/assessments`);
    return res.data;
}

//# sourceMappingURL=assess.js.map