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
    ensureAdminAuth: function() {
        return ensureAdminAuth;
    },
    ensureAuth: function() {
        return ensureAuth;
    }
});
async function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send({
        message: 'Unauthorized',
        reason: 'You are not logged in'
    });
}
async function ensureAdminAuth(req, res, next) {
    next();
}

//# sourceMappingURL=auth.js.map