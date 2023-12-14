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
    AuthController: function() {
        return AuthController;
    },
    default: function() {
        return _default;
    }
});
const _googleapis = require("googleapis");
const _OpenBrowserUtil = _interop_require_default(require("../utils/OpenBrowserUtil"));
const _dotenv = _interop_require_default(require("dotenv"));
const _passport = _interop_require_default(require("passport"));
require("../configs/passport");
const _env = _interop_require_default(require("../configs/env"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
let AuthController = class AuthController {
    static async handleOAuthCallback(req, res) {
        const { code: urlCode } = req.query;
        console.log(urlCode);
        try {
            if (!urlCode) throw new Error("Authorization code not found in the URL.");
            const code = req.query.code;
            console.log("Authorization code", code);
            const { tokens } = await AuthController.oAuth2Client.getToken(code);
            console.log("Token", tokens);
            AuthController.oAuth2Client.setCredentials(tokens);
            const userInfoResponse = await AuthController.oauth2.userinfo.get();
            AuthController.userEmail = userInfoResponse.data.email || "";
            req.session.tokens = tokens;
            AuthController.tokenn = tokens;
            res.redirect("http://localhost:3000/");
        } catch (error) {
            console.error("Error exchanging code for tokens:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    static authenticateUser(req, res) {
        const authUrl = AuthController.oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/userinfo.email"
            ],
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URL
        });
        _OpenBrowserUtil.default.open(authUrl);
        res.redirect(authUrl);
    }
    constructor(){
        _define_property(this, "login", async (req, res, next)=>{
            _passport.default.authenticate("local", function(err, user) {
                if (err || !user) {
                    return res.status(401).json({
                        message: err
                    });
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.status(200).json({
                        message: "Sign in successful!",
                        error: false,
                        user: req.user
                    });
                });
            })(req, res, next);
        });
        _define_property(this, "signout", async (req, res, next)=>{
            req.logout(function(err) {
                if (err) return next(err);
                res.status(200).clearCookie(_env.default.AUTH_COOKIE_NAME, {
                    domain: _env.default.COOKIE_DOMAIN
                });
                req.session.destroy(function(err) {
                    if (err) return next(err);
                    return res.status(200).send({
                        message: "Logged out successfully",
                        error: false
                    });
                });
            });
        });
    }
};
_define_property(AuthController, "userEmail", void 0);
_define_property(AuthController, "tokenn", void 0);
_define_property(AuthController, "oAuth2Client", new _googleapis.google.auth.OAuth2(process.env.CLIENT_ID || "", process.env.CLIENT_SECRET || "", process.env.REDIRECT_URI || ""));
_define_property(AuthController, "oauth2", _googleapis.google.oauth2({
    auth: AuthController.oAuth2Client,
    version: "v2"
}));
const _default = AuthController;

//# sourceMappingURL=auth.controller.js.map