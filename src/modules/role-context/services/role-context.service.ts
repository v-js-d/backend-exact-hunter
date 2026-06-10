import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

import { RoleContextRepository } from '../repositories/role-context.repository';
import { RoleContextWithHrRole } from '../types/role-context-access.type';

@Injectable()
export class RoleContextService {
	constructor(private readonly roleContextRepository: RoleContextRepository) {}

	findByIdWithHrRole(id: string): Promise<RoleContextWithHrRole | null> {
		return this.roleContextRepository.findByIdWithHrRole(id);
	}

	findFirstForUserWithHrRole(userId: string, userRole: UserRole): Promise<RoleContextWithHrRole | null> {
		return this.roleContextRepository.findFirstByUserIdAndUserRole(userId, userRole);
	}
}
