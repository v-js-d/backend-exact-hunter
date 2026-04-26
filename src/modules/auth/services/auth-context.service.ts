import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthSessionRequestDto } from '../dto/auth-session.request.dto';
import { AuthenticatedUser } from '../types/authenticated-user.type';
import { AccessTokenPayload } from '@/modules/token';
import { PrismaService } from '@/prisma';

@Injectable()
export class AuthContextService {
	constructor(private readonly prisma: PrismaService) {}

	private assertRoleScope(role: UserRole): asserts role is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (role !== UserRole.CANDIDATE && role !== UserRole.EMPLOYER) {
			throw new UnauthorizedException(EnumAuthError.AUTH_SCOPE_NOT_SUPPORTED);
		}
	}

	async buildAccessPayload(dto: AuthSessionRequestDto): Promise<AccessTokenPayload> {
		this.assertRoleScope(dto.userRole);
		const roleContext = await this.prisma.roleContext.findUnique({
			where: { id: dto.roleContextId },
			include: { hrRole: true },
		});

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
	async buildAuthenticatedUser(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
		this.assertRoleScope(payload.userRole);

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true, email: true },
		});
		if (!user) {
			throw new UnauthorizedException(EnumAuthError.USER_NOT_FOUND);
		}

		const roleContext = await this.prisma.roleContext.findUnique({
			where: { id: payload.roleContextId },
		});
		if (!roleContext || roleContext.userId !== payload.sub || roleContext.userRole !== payload.userRole) {
			throw new UnauthorizedException(EnumAuthError.INVALID_ROLE_CONTEXT);
		}

		return {
			user: { id: user.id, email: user.email },
			currentRole: payload.userRole,
			roleContextId: payload.roleContextId,
			companyId: payload.companyId,
			hrRoleName: payload.hrRoleName,
		};
	}
}
