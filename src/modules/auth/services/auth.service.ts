import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthMeResponseDto } from '../dto/auth-me.response.dto';
import { AuthSessionRequestDto } from '../dto/auth-session.request.dto';
import { AuthSessionResponseDto } from '../dto/auth-session.response.dto';
import { AuthenticatedUser } from '../types/authenticated-user.type';
import { AuthContextService } from './auth-context.service';
import { AuthRequestMetaService } from './auth-request-meta.service';
import { AuthCookieService, EnumCookieError } from '@/common/cookie';
import { AuthTokenPair, TokenService } from '@/modules/token';

/**
 * Оркестратор auth-флоу.
 *
 * Login/refresh с `@SetAuthCookie` возвращают `tokens` в DTO — куки ставит
 * `AuthCookieInterceptor`. Очистка кук (ошибка refresh, logout) и чтение кук для
 * refresh — через `AuthCookieService` в этом сервисе.
 */
@Injectable()
export class AuthService {
	constructor(
		private readonly tokenService: TokenService,
		private readonly authCookieService: AuthCookieService,
		private readonly authContextService: AuthContextService,
		private readonly authRequestMetaService: AuthRequestMetaService,
	) {}

	async login(dto: AuthSessionRequestDto, request: Request): Promise<AuthSessionResponseDto> {
		const payload = await this.authContextService.buildAccessPayload(dto);
		const requestMeta = this.authRequestMetaService.fromRequest(request);
		const pair = await this.tokenService.generateTokenPair(payload, requestMeta);

		return {
			tokens: pair,
			userId: payload.sub,
			roleContextId: payload.roleContextId,
			userRole: payload.userRole,
		};
	}

	async refresh(request: Request, response: Response): Promise<{ tokens: AuthTokenPair; ok: true }> {
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

			return { tokens: newPair, ok: true };
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

	me(currentUser: AuthenticatedUser): AuthMeResponseDto {
		return {
			id: currentUser.user.id,
			email: currentUser.user.email,
			role: currentUser.currentRole,
		};
	}
}
