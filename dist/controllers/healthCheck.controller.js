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
let HealthCheckController = class HealthCheckController {
    async get(req, res) {
        const ip = req.headers['x-forwarded-for'] || req.ip;
        res.send({
            status: 'OK',
            message: 'Hello World..!',
            ip
        });
    }
};
const _default = HealthCheckController;

//# sourceMappingURL=healthCheck.controller.js.map