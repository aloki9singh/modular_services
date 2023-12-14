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
const _logmodel = _interop_require_default(require("../models/log.model"));
const _urlmodel = _interop_require_default(require("../models/url.model"));
const _calculateUniqueVisitors = require("../services/calculateUniqueVisitors");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let LogController = class LogController {
    async getURLAnalytics(req, res) {
        try {
            const { short_id } = req.params;
            const urlDetails = await _urlmodel.default.findOne({
                short_id
            });
            if (!urlDetails) {
                res.status(404).json({
                    error: "URL not found"
                });
                return;
            }
            const accessLogs = await _logmodel.default.find({
                url_id: urlDetails._id
            });
            const uniqueVisitors = (0, _calculateUniqueVisitors.calculateUniqueVisitors)(accessLogs);
            const analyticsData = {
                original_url: urlDetails.original_url,
                short_id: urlDetails.short_id,
                expiration_date: urlDetails.expiration_date,
                starting_date: urlDetails.starting_date,
                title: urlDetails.title,
                description: urlDetails.description,
                status: urlDetails.status,
                short_url: urlDetails.short_url,
                stats: {
                    total_visitors: accessLogs.length,
                    unique_visitors: uniqueVisitors
                }
            };
            res.json({
                url_details: analyticsData
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
    async getAllVisitors(req, res) {
        try {
            const { short_id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = 6;
            const urlDetails = await _urlmodel.default.findOne({
                short_id
            });
            if (!urlDetails) {
                res.status(404).json({
                    error: "URL not found"
                });
                return;
            }
            const skip = (page - 1) * limit;
            const accessLogs = await _logmodel.default.find({
                url_id: urlDetails._id
            }).skip(skip).limit(limit);
            res.json(accessLogs);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
};
const _default = LogController;

//# sourceMappingURL=log.controller.js.map