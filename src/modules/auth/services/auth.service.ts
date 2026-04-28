import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { User, UserRole } from 'generated/prisma/client';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthSessionRequestDto } from '../dto/auth-session/auth-session.request.dto';
import { AuthSessionUserDto } from '../dto/auth-session/auth-session-user.dto';
import { MeResponseDto } from '../dto/me/me-response.dto';
import { AuthenticatedUser } from '../types/authenticated-user.type';
import { AuthContextService } from './auth-context.service';
import { AuthRequestMetaService } from './auth-request-meta.service';
import { AuthCookieService, EnumCookieError } from '@/common/cookie';
import { RoleContextService } from '@/modules/role-context';
import { AuthTokenPair, TokenService } from '@/modules/token';
import { UserService } from '@/modules/user';

@Injectable()
export class AuthService {
	constructor(
		private readonly tokenService: TokenService,
		private readonly authCookieService: AuthCookieService,
		private readonly authRequestMetaService: AuthRequestMetaService,
		private readonly userService: UserService,
		private readonly roleContextService: RoleContextService,
		private readonly authContextService: AuthContextService,
	) {}

	async getAuthenticatedToken(request: Request, userId: string, userRole: UserRole): Promise<AuthTokenPair> {
		const roleContext = await this.roleContextService.findFirstForUserWithHrRole(userId, userRole);
		if (!roleContext) {
			throw new UnauthorizedException(EnumAuthError.ROLE_NOT_FOUND);
		}

		if (roleContext.userRole !== userRole) {
			//пытается зайти как одна роль, но он на самом деле другая роль
			//сейчас у нас один user = одна роль
			//если будем менять - тут надо будет изменить
			throw new UnauthorizedException(EnumAuthError.ROLE_NOT_ALLOWED);
		}
		const buildData: AuthSessionRequestDto = {
			roleContextId: roleContext.id,
			userId: userId,
			userRole: roleContext.userRole,
		};

		const payload = await this.authContextService.buildAccessPayload(buildData);
		const requestMeta = this.authRequestMetaService.fromRequest(request);
		const pair = await this.tokenService.generateTokenPair(payload, requestMeta);
		return pair;
	}
	getAuthenticatedUser(user: User, userRole: UserRole): AuthSessionUserDto {
		return {
			id: user.id,
			email: user.email,
			role: userRole,
			isActivated: user.isActivated,
		};
	}

	async refresh(
		request: Request,
		response: Response,
	): Promise<{ tokens: AuthTokenPair; ok: true; user: AuthSessionUserDto }> {
		const refreshToken = this.authCookieService.getRefreshToken(request);
		const accessToken = this.authCookieService.getAccessToken(request);

		if (!refreshToken || !accessToken) {
			this.authCookieService.clearAuthCookies(response);
			throw new UnauthorizedException(EnumCookieError.REFRESH_COOKIE_MISSING);
		}

		try {
			const payload = await this.tokenService.decodeAccessTokenIgnoringExpiration(accessToken);
			const meta = this.authRequestMetaService.fromRequest(request);

			await this.tokenService.validateRefreshToken(refreshToken, payload.sub, payload.roleContextId, meta.deviceId);

			const newPair = await this.tokenService.rotateRefreshToken(payload, meta);

			const user = await this.userService.findById(payload.sub);
			if (!user) {
				this.authCookieService.clearAuthCookies(response);
				throw new UnauthorizedException();
			}

			return {
				tokens: newPair,
				ok: true,
				user: {
					id: user.id,
					email: user.email,
					role: payload.userRole,
					isActivated: user.isActivated,
				},
			};
		} catch {
			this.authCookieService.clearAuthCookies(response);
			throw new UnauthorizedException();
		}
	}

	async logout(currentUser: AuthenticatedUser, request: Request, response: Response): Promise<void> {
		const requestMeta = this.authRequestMetaService.fromRequest(request);
		try {
			await this.tokenService.removeToken(currentUser.user.id, currentUser.roleContextId, requestMeta.deviceId);
		} finally {
			this.authCookieService.clearAuthCookies(response);
		}
	}

	me(current: AuthenticatedUser): MeResponseDto {
		return {
			user: {
				id: current.user.id,
				email: current.user.email,
				role: current.currentRole,
				userRoleName: current.hrRoleName ?? null,
				isActivated: current.user.isActivated,
			},
		};
	}

	/** Тестовый endpoint: удаляет `User`; `RoleContext`, `Token` и др.
	 *
	 * `onDelete: Cascade` уходят сами (см. Prisma schema). */
	async delete(id: string): Promise<boolean> {
		try {
			await this.userService.delete(id);
			return true;
		} catch {
			throw new NotFoundException(EnumAuthError.USER_NOT_FOUND);
		}
	}
}
