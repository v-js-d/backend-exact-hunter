import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthSessionRequestDto } from '../dto/auth-session.request.dto';
import { AuthTokenPair, resolveDeviceIdFromHeaders } from '@/common/auth';
import { AccessTokenPayload, RequestMeta, TokenService } from '@/modules/token';
import { PrismaService } from '@/prisma';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly tokenService: TokenService,
	) {}

	private buildMeta(request: Request): RequestMeta {
		const deviceId = resolveDeviceIdFromHeaders(request.headers);
		return {
			deviceId,
			deviceName: typeof request.headers['x-device-name'] === 'string' ? request.headers['x-device-name'] : undefined,
			userAgent: request.headers['user-agent'],
			ipAddress: request.ip,
		};
	}

	private async buildPayload(dto: AuthSessionRequestDto): Promise<AccessTokenPayload> {
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

	private assertRoleScope(role: UserRole): asserts role is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (role !== UserRole.CANDIDATE && role !== UserRole.EMPLOYER) {
			throw new UnauthorizedException(EnumAuthError.AUTH_SCOPE_NOT_SUPPORTED);
		}
	}

	async login(dto: AuthSessionRequestDto, request: Request): Promise<AuthTokenPair> {
		const payload = await this.buildPayload(dto);
		return this.tokenService.generateTokenPair(payload, this.buildMeta(request));
	}

	async refresh(dto: AuthSessionRequestDto, refreshToken: string, request: Request): Promise<AuthTokenPair> {
		const payload = await this.buildPayload(dto);
		const meta = this.buildMeta(request);

		await this.tokenService.validateRefreshToken(refreshToken, payload.sub, payload.roleContextId, meta.deviceId);
		return this.tokenService.rotateRefreshToken(payload, meta);
	}

	async logout(dto: AuthSessionRequestDto, request: Request): Promise<void> {
		const payload = await this.buildPayload(dto);
		const meta = this.buildMeta(request);
		await this.tokenService.removeToken(payload.sub, payload.roleContextId, meta.deviceId);
	}
}
