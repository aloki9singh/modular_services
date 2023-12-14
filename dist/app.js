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
const _express = _interop_require_default(require("express"));
const _cors = _interop_require_default(require("cors"));
const _hpp = _interop_require_default(require("hpp"));
const _helmet = _interop_require_default(require("helmet"));
const _compression = _interop_require_default(require("compression"));
const _mongoose = require("mongoose");
const _env = _interop_require_default(require("./configs/env"));
const _expresssession = _interop_require_default(require("express-session"));
const _passport = _interop_require_default(require("passport"));
const _connectmongodbsession = _interop_require_default(require("connect-mongodb-session"));
const _passport1 = _interop_require_default(require("./configs/passport"));
const _morgan = _interop_require_default(require("morgan"));
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
const MongoDBSession = (0, _connectmongodbsession.default)(_expresssession.default);
(0, _passport1.default)(_passport.default);
let App = class App {
    listen() {
        this.app.listen(this.port, ()=>{
            console.log(`App listening on the port ${this.port}`);
        });
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        if (this.env !== 'production') {
            (0, _mongoose.set)('debug', false);
        }
        (0, _mongoose.connect)(_env.default.MONGODB_URI).then(()=>{
            console.log('Connected to DB');
        }).catch((error)=>{
            console.error(error);
        });
    }
    initializeRoutes(routes) {
        routes.forEach((route)=>{
            this.app.use('/', route.router);
        });
    }
    initializeMiddlewares() {
        this.setupCORS();
        this.app.use((0, _hpp.default)());
        this.app.use((0, _helmet.default)());
        this.app.use((0, _compression.default)());
        this.app.use(_express.default.json({
            limit: '1mb'
        }));
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
        this.app.use(_passport.default.initialize());
        this.app.use((0, _expresssession.default)({
            secret: _env.default.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: this.store,
            name: _env.default.AUTH_COOKIE_NAME,
            cookie: {
                domain: _env.default.COOKIE_DOMAIN,
                maxAge: 1000 * 60 * 60 * 24 * 30,
                sameSite: 'lax',
                secure: this.env === 'production',
                httpOnly: true
            }
        }));
        this.app.use(_passport.default.session());
        this.app.use((0, _morgan.default)('dev'));
    }
    setupCORS() {
        const origins = [];
        if ([
            'development'
        ].includes(_env.default.NODE_ENV)) {
            origins.push(/localhost:/);
        }
        const corsOrigins = _env.default.CORS_ORIGINS.split(',');
        if (corsOrigins.length > 0) {
            origins.push(...corsOrigins.map((corsOrigin)=>{
                return corsOrigin.trim();
            }));
        }
        this.app.use((0, _cors.default)({
            origin: origins,
            credentials: true
        }));
    }
    constructor(routes){
        _define_property(this, "app", void 0);
        _define_property(this, "env", void 0);
        _define_property(this, "port", void 0);
        _define_property(this, "store", void 0);
        this.app = (0, _express.default)();
        this.env = _env.default.NODE_ENV || 'development';
        this.port = _env.default.PORT || 3000;
        this.store = new MongoDBSession({
            uri: _env.default.MONGODB_URI,
            collection: 'adminSessions'
        });
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
    }
};
const _default = App;

//# sourceMappingURL=app.js.map