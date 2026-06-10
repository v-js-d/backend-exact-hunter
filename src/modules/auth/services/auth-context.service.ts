import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

import { RoleContextService } from '@/modules/role-context';
import { IAccessTokenPayload } from '@/modules/token';
import { UserService } from '@/modules/user';

import { EnumAuthError } from '../consts/auth.errors';
import { IAuthBuildPayload } from '../types/authenticated-context.interface';
import { AuthenticatedUser } from '../types/authenticated-user.interface';

@Injectable()
export class AuthContextService {
	constructor(
		private readonly userService: UserService,
		private readonly roleContextService: RoleContextService,
	) {}

	private assertRoleScope(role: UserRole): asserts role is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (role !== UserRole.CANDIDATE && role !== UserRole.EMPLOYER) {
			throw new UnauthorizedException(EnumAuthError.AUTH_SCOPE_NOT_SUPPORTED);
		}
	}

	async buildAccessPayload(dto: IAuthBuildPayload): Promise<IAccessTokenPayload> {
		this.assertRoleScope(dto.userRole);
		const roleContext = await this.roleContextService.findByIdWithHrRole(dto.roleContextId);

		if (!roleContext || roleContext.userId !== dto.userId || roleContext.userRole !== dto.userRole) {
			throw new UnauthorizedException(EnumAuthError.INVALID_ROLE_CONTEXT);
		}

		return {
			sub: roleContext.userId,
			roleContextId: roleContext.id,
			userRole: roleContext.userRole,
			companyId: roleContext.companyId,
			hrRoleName: roleContext.hrRole?.name ?? null,
		};
	}

	/**
	 * Единая точка сборки `request.user` из JWT-payload: проверяет, что user и
	 * role-context до сих пор существуют и согласованы, и возвращает безопасный
	 * объект профиля, который цепляют `AccessJwtStrategy.validate`.
	 */
	async buildAuthenticatedUser(payload: IAccessTokenPayload): Promise<AuthenticatedUser> {
		this.assertRoleScope(payload.userRole);

		const user = await this.userService.findByIdWithRoleContexts(payload.sub);
		if (!user) {
			throw new UnauthorizedException(EnumAuthError.USER_NOT_FOUND);
		}

		const roleContext = user.roleContexts.find(
			(rc) => rc.id === payload.roleContextId && rc.userRole === payload.userRole,
		);
		if (!roleContext || roleContext.userId !== payload.sub) {
			throw new UnauthorizedException(EnumAuthError.INVALID_ROLE_CONTEXT);
		}

		return {
			user: {
				id: user.id,
				email: user.email ?? undefined,
				phone: user.phone ?? undefined,
				identifierType: user.identifierType,
				isActivated: user.isActivated,
			},
			currentRole: payload.userRole,
			roleContextId: payload.roleContextId,
			companyId: payload.companyId,
			hrRoleName: payload.hrRoleName,
		};
	}
}
