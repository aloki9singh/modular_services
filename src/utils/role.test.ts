
import { AdminUserRole } from '../interfaces/enums';
import { isSuperAdmin } from './role';

describe('Role test suite', () => {
    describe('Super Admin', () => {
        it('Is not a super admin', () => {
            expect(isSuperAdmin({
                role: AdminUserRole.ADMIN,
            })).toBe(false);
        });
        it('Is super admin', () => {
            expect(isSuperAdmin({
                role: AdminUserRole.SUPER_ADMIN,
            })).toBe(true);
        });
    })
})