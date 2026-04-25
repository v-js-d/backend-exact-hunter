import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigCookieService } from './config-cookie.service';

@Injectable()
export class AuthCookieService {
	constructor(private readonly configCookieService: ConfigCookieService) {}

	setAccessToken(response: Response, accessToken: string): void {
		const { access } = this.configCookieService.getCookieNames();
		const { access: accessOptions } = this.configCookieService.getCookieConfig();
		response.cookie(access, accessToken, accessOptions);
	}

	setRefreshToken(response: Response, refreshToken: string): void {
		const { refresh } = this.configCookieService.getCookieNames();
		const { refresh: refreshOptions } = this.configCookieService.getCookieConfig();
		response.cookie(refresh, refreshToken, refreshOptions);
	}

	getAccessToken(request: Request): string | undefined {
		const { access } = this.configCookieService.getCookieNames();
		const cookies = (request.cookies ?? {}) as Record<string, unknown>;
		const raw = cookies[access];
		return typeof raw === 'string' && raw.length > 0 ? raw : undefined;
	}

	getRefreshToken(request: Request): string | undefined {
		const { refresh } = this.configCookieService.getCookieNames();
		const cookies = (request.cookies ?? {}) as Record<string, unknown>;
		const raw = cookies[refresh];
		return typeof raw === 'string' && raw.length > 0 ? raw : undefined;
	}

	clearAuthCookies(response: Response): void {
		const names = this.configCookieService.getCookieNames();
		const clearOptions = this.configCookieService.getClearCookieOptions();
		response.clearCookie(names.access, clearOptions);
		response.clearCookie(names.refresh, clearOptions);
	}
}
