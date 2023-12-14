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
const _validator = _interop_require_default(require("validator"));
const _urlmodel = _interop_require_default(require("../models/url.model"));
const _logmodel = _interop_require_default(require("../models/log.model"));
const _dotenv = _interop_require_default(require("dotenv"));
const _url = require("../services/url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
let UrlController = class UrlController {
    async shortenURL(req, res) {
        try {
            const { original_url, expiration_date, title, description } = req.body;
            if (!_validator.default.isURL(original_url)) {
                res.status(400).json({
                    error: "Invalid URL format"
                });
                return;
            }
            const short_id = (0, _url.generateUniqueShortID)();
            const expirationDate = (0, _url.getExpirationDate)(expiration_date);
            const url = (0, _url.createNewURL)(original_url, short_id, expirationDate, title, description);
            await url.save();
            res.json({
                short_url: url.short_url,
                short_id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
    async redirectToOriginalURL(req, res) {
        try {
            const { shortId } = req.params;
            const ip_address = req.headers["x-forwarded-for"] || req.ip;
            const referrer = req.headers.referer || req.headers.referrer || "No referrer";
            console.log("referrer", referrer);
            const url = await _urlmodel.default.findOne({
                short_id: shortId
            });
            if (!url) {
                res.status(404).json({
                    error: "URL not found"
                });
                return;
            }
            if (url.expiration_date && new Date(url.expiration_date) < new Date()) {
                url.status = "expired";
                await url.save();
                res.status(400).json({
                    error: "URL has expired"
                });
                return;
            }
            const log = await _logmodel.default.create({
                url_id: url._id,
                ip_address,
                visit_time: Date.now(),
                referrer
            });
            res.redirect(url.original_url);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
    async updateURL(req, res) {
        try {
            const { shortId } = req.params;
            const updateFields = req.body;
            const url = await _urlmodel.default.findOne({
                short_id: shortId
            });
            if (!url) {
                res.status(404).json({
                    error: "URL not found"
                });
                return;
            }
            if (updateFields.expiration_date) {
                const newExpirationDate = new Date(updateFields.expiration_date);
                if (newExpirationDate <= new Date()) {
                    res.status(400).json({
                        error: "Expiry date cannot be set in the past or present"
                    });
                    return;
                }
                url.expiration_date = newExpirationDate;
                url.status = 'active';
            }
            for (const [key, value] of Object.entries(updateFields)){
                if (key !== "expiration_date") {
                    url[key] = value;
                }
            }
            await url.save();
            res.json(updateFields);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
    async getShortUrlsByAppId(req, res) {
        try {
            const { page } = req.query;
            const pageSize = 10;
            const result = await _urlmodel.default.find().skip((page - 1) * pageSize).limit(pageSize).sort({
                createdAt: "desc"
            });
            res.send(result);
        } catch (error) {
            console.error("Error fetching URLs by App Id:", error);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
    async deleteShortUrl(req, res) {
        const { shortId } = req.params;
        try {
            const deletedUrl = await _urlmodel.default.findOneAndDelete({
                short_id: shortId
            });
            if (deletedUrl) {
                res.json({
                    success: true,
                    message: "URL deleted successfully"
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "URL not found"
                });
            }
        } catch (error) {
            console.error("Error deleting URL by shortId:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
};
const _default = UrlController;

//# sourceMappingURL=url.controller.js.map