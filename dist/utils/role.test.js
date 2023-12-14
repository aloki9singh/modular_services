"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _enums = require("../interfaces/enums");
const _role = require("./role");
describe('Role test suite', ()=>{
    describe('Super Admin', ()=>{
        it('Is not a super admin', ()=>{
            expect((0, _role.isSuperAdmin)({
                role: _enums.AdminUserRole.ADMIN
            })).toBe(false);
        });
        it('Is super admin', ()=>{
            expect((0, _role.isSuperAdmin)({
                role: _enums.AdminUserRole.SUPER_ADMIN
            })).toBe(true);
        });
    });
});

//# sourceMappingURL=role.test.js.map