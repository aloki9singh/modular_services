"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSuperAdmin", {
    enumerable: true,
    get: function() {
        return isSuperAdmin;
    }
});
const _enums = require("../interfaces/enums");
const isSuperAdmin = (user)=>{
    return user.role === _enums.AdminUserRole.SUPER_ADMIN;
};

//# sourceMappingURL=role.js.map