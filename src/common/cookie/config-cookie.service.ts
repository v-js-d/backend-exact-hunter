import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import ms, { StringValue } from 'ms';

import {
	ACCESS_COOKIE_NAME_ENV_KEY,
	AUTH_COOKIE_DOMAIN_ENV_KEY,
	AUTH_COOKIE_SECURE_ENV_KEY,
	BOOLEAN_FALSE_STRING,
	BOOLEAN_TRUE_STRING,
	COOKIE_PATH_ROOT,
	DEFAULT_ACCESS_COOKIE_NAME,
	DEFAULT_REFRESH_COOKIE_NAME,
	NODE_ENV_ENV_KEY,
	NODE_ENV_PRODUCTION,
	REFRESH_COOKIE_NAME_ENV_KEY,
	SAME_SITE_LAX,
} from './cookie.consts';
import { getTtlFromConfig } from '@/modules/token';

@Injectable()
export class ConfigCookieService {
	constructor(private readonly configService: ConfigService) {}

	private sharedCookieOptions(): Pick<CookieOptions, 'httpOnly' | 'secure' | 'sameSite' | 'path' | 'domain'> {
		const domain = this.configService.get<string>(AUTH_COOKIE_DOMAIN_ENV_KEY)?.trim();
		const secure = this.isSecureCookies();
		return {
			httpOnly: true,
			secure,
			sameSite: SAME_SITE_LAX,
			path: COOKIE_PATH_ROOT,
			domain: domain && domain.length > 0 ? domain : undefined,
		};
	}

	private refreshTokenMaxAgeMs(): number {
		const ttl = getTtlFromConfig(this.configService);
		return ms(ttl as StringValue);
	}

	/**
	 * Both cookies live as long as the refresh session does.
	 * The access JWT inside the cookie still has its own short `exp` claim that
	 * is enforced by the JWT strategy. Keeping the access cookie maxAge вровень с
	 * refresh позволяет `POST /auth/refresh` читать (уже просроченный) access
	 * ещё из куки и знать `sub` / `roleContextId` при ротации, пока сессия жива.
	 */
	private accessCookieMaxAgeMs(): number {
		return this.refreshTokenMaxAgeMs();
	}

	private isSecureCookies(): boolean {
		const explicit = this.configService.get<string>(AUTH_COOKIE_SECURE_ENV_KEY);
		if (explicit === BOOLEAN_TRUE_STRING) return true;
		if (explicit === BOOLEAN_FALSE_STRING) return false;
		return this.configService.get<string>(NODE_ENV_ENV_KEY) === NODE_ENV_PRODUCTION;
	}

	public getCookieConfig(): {
		access: CookieOptions;
		refresh: CookieOptions;
	} {
		const base = this.sharedCookieOptions();
		return {
			access: { ...base, maxAge: this.accessCookieMaxAgeMs() },
			refresh: { ...base, maxAge: this.refreshTokenMaxAgeMs() },
		};
	}

	public getClearCookieOptions(): Pick<CookieOptions, 'path' | 'domain' | 'sameSite' | 'secure'> {
		const base = this.sharedCookieOptions();
		return {
			path: base.path,
			domain: base.domain,
			sameSite: base.sameSite,
			secure: base.secure,
		};
	}

	public getCookieNames(): { access: string; refresh: string } {
		return {
			access: this.configService.get<string>(ACCESS_COOKIE_NAME_ENV_KEY) || DEFAULT_ACCESS_COOKIE_NAME,
			refresh: this.configService.get<string>(REFRESH_COOKIE_NAME_ENV_KEY) || DEFAULT_REFRESH_COOKIE_NAME,
		};
	}
}
