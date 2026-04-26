import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { EnumTokenError } from '@/modules/token/consts/token.consts';
import { AuthCookieService } from '@/common/cookie';

/**
 * Cookie-only guard: валидирует access JWT из access-куки (Passport `access-jwt`).
 * Просроченный / невалидный / отсутствующий access → 401 с кодом из `EnumTokenError`
 * (фронт сам вызывает `POST /auth/refresh` с куками).
 */
@Injectable()
export class AccessJwtGuard extends AuthGuard('access-jwt') {
	constructor(private readonly authCookieService: AuthCookieService) {
		super();
	}

	handleRequest<TUser = unknown>(err: unknown, user: TUser, info: unknown, context: ExecutionContext): TUser {
		if (user) {
			return user;
		}

		if (err) {
			if (err instanceof UnauthorizedException) {
				throw err;
			}
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
		}

		const e = info as Error | null | undefined;
		const name = e?.name;
		const message = e?.message ?? '';

		if (name === 'TokenExpiredError' || message === 'jwt expired') {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_EXPIRED);
		}
		if (name === 'NotBeforeError') {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
		}
		if (name === 'JsonWebTokenError' || /invalid token|jwt malformed/i.test(message)) {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
		}
		if (name === 'Error' && message === 'No auth token') {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_MISSING);
		}

		const request = this.getRequest(context) as Request;
		if (!this.authCookieService.getAccessToken(request)) {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_MISSING);
		}
		throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
	}
}
