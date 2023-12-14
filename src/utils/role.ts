import { AdminUserRole } from '../interfaces/enums';
import { User } from '../interfaces/user';

export const isSuperAdmin = (user: Pick<User,'role'>) => {
	return user.role === AdminUserRole.SUPER_ADMIN;
};
