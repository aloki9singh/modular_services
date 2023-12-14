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
const _bcrypt = _interop_require_default(require("bcrypt"));
const _passportlocal = require("passport-local");
const _usermodel = _interop_require_default(require("../models/user.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _default(passport) {
    passport.use(new _passportlocal.Strategy({
        usernameField: 'email'
    }, async (email, password, done)=>{
        const user = await _usermodel.default.findOne({
            email: email
        });
        if (!user) {
            return done('Email not found', false);
        }
        if (_bcrypt.default.compareSync(password, user.password) === false) {
            return done(`Email or password is incorrect: ${password}`, false);
        }
        return done(null, user);
    }));
    passport.serializeUser(function(user, done) {
        return done(null, user._id);
    });
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await _usermodel.default.findOne({
                _id: id
            });
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    });
}

//# sourceMappingURL=passport.js.map