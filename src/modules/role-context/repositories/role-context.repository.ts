import { UserRole } from 'generated/prisma/enums';

import { RoleContextWithHrRole } from '../types/role-context-access.type';

export abstract class RoleContextRepository {
	abstract findByIdWithHrRole(id: string): Promise<RoleContextWithHrRole | null>;
	abstract findFirstByUserIdAndUserRole(userId: string, userRole: UserRole): Promise<RoleContextWithHrRole | null>;
}
