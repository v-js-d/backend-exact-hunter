import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserRole } from 'generated/prisma/enums';

import { ConfigCookieService } from './config-cookie.service';
import { AuthTokenPair } from '@/common/auth';

@Injectable()
export class AuthCookieService {
	constructor(private readonly configCookieService: ConfigCookieService) {}

	getRefreshTokenFromRequestCookies(cookies: Record<string, unknown>, scope: UserRole): string | null {
		const cookieName = this.configCookieService.getCookieNames(scope).refresh;
		const value = cookies[cookieName];
		return typeof value === 'string' && value.length > 0 ? value : null;
	}

	setAuthCookies(response: Response, scope: UserRole, payload: AuthTokenPair): void {
		const names = this.configCookieService.getCookieNames(scope);
		const { access, refresh } = this.configCookieService.getCookieConfig(scope);
		response.cookie(names.access, payload.accessToken, access);
		response.cookie(names.refresh, payload.refreshToken, refresh);
	}

	clearAuthCookies(response: Response, scope: UserRole): void {
		const names = this.configCookieService.getCookieNames(scope);
		const clearOptions = this.configCookieService.getClearCookieOptions(scope);
		response.clearCookie(names.access, clearOptions);
		response.clearCookie(names.refresh, clearOptions);
	}
}
