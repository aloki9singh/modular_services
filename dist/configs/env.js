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
const _envalid = require("envalid");
const _dotenv = require("dotenv");
const validateEnv = ()=>{
    const env = (0, _dotenv.config)({
        path: `.env.${process.env.NODE_ENV}.local`
    }).parsed;
    const cleanedEnv = (0, _envalid.cleanEnv)(env, {
        NODE_ENV: (0, _envalid.str)(),
        PORT: (0, _envalid.port)(),
        MONGODB_URI: (0, _envalid.str)(),
        OPENAI_API_KEY: (0, _envalid.str)(),
        COOKIE_DOMAIN: (0, _envalid.str)(),
        SESSION_SECRET: (0, _envalid.str)(),
        AUTH_COOKIE_NAME: (0, _envalid.str)(),
        CORS_ORIGINS: (0, _envalid.str)()
    });
    return cleanedEnv;
};
console.log("Validating env...");
const env = validateEnv();
console.log("Validated env: It's all good!");
const _default = env;

//# sourceMappingURL=env.js.map