import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

import { PrismaService } from '@/prisma';

import { RoleContextRepository } from './role-context.repository';

import { ROLE_CONTEXT_WITH_HR_ROLE_INCLUDE } from '../types/role-context-access.type';

@Injectable()
export class RoleContextPrismaRepository implements RoleContextRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByIdWithHrRole(id: string) {
		return this.prisma.roleContext.findUnique({
			where: { id },
			include: ROLE_CONTEXT_WITH_HR_ROLE_INCLUDE,
		});
	}

	async findFirstByUserIdAndUserRole(userId: string, userRole: UserRole) {
		return this.prisma.roleContext.findFirst({
			where: { userId, userRole },
			include: ROLE_CONTEXT_WITH_HR_ROLE_INCLUDE,
		});
	}
}
