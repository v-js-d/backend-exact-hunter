import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import ms, { StringValue } from 'ms';
import { UserRole } from 'generated/prisma/enums';

import {
	AUTH_COOKIE_DOMAIN_ENV_KEY,
	AUTH_COOKIE_SECURE_ENV_KEY,
	BOOLEAN_FALSE_STRING,
	BOOLEAN_TRUE_STRING,
	CANDIDATE_ACCESS_COOKIE_NAME_ENV_KEY,
	CANDIDATE_REFRESH_COOKIE_NAME_ENV_KEY,
	COOKIE_PATH_ROOT,
	DEFAULT_CANDIDATE_ACCESS_COOKIE_NAME,
	DEFAULT_CANDIDATE_REFRESH_COOKIE_NAME,
	DEFAULT_EMPLOYER_ACCESS_COOKIE_NAME,
	DEFAULT_EMPLOYER_REFRESH_COOKIE_NAME,
	EMPLOYER_ACCESS_COOKIE_NAME_ENV_KEY,
	EMPLOYER_REFRESH_COOKIE_NAME_ENV_KEY,
	NODE_ENV_ENV_KEY,
	NODE_ENV_PRODUCTION,
	SAME_SITE_LAX,
} from './cookie.consts';
import { EnumCookieError } from './cookie.errors';
import { EnumTokenConfig } from '@/modules/token/consts/token.consts';

@Injectable()
export class ConfigCookieService {
	constructor(private readonly configService: ConfigService) {}

	private assertAuthCookieScope(
		scope: UserRole,
	): asserts scope is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (scope !== UserRole.CANDIDATE && scope !== UserRole.EMPLOYER) {
			throw new BadRequestException(EnumCookieError.AUTH_COOKIE_SCOPE_NOT_SUPPORTED);
		}
	}

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

	private accessTokenMaxAgeMs(): number {
		const ttl = this.configService.getOrThrow<string>(EnumTokenConfig.JWT_ACCESS_EXPIRES_IN);
		return ms(ttl as StringValue);
	}

	private refreshTokenMaxAgeMs(): number {
		const ttl = this.configService.getOrThrow<string>(EnumTokenConfig.REFRESH_TOKEN_EXPIRES_IN);
		return ms(ttl as StringValue);
	}

	private isSecureCookies(): boolean {
		const explicit = this.configService.get<string>(AUTH_COOKIE_SECURE_ENV_KEY);
		if (explicit === BOOLEAN_TRUE_STRING) return true;
		if (explicit === BOOLEAN_FALSE_STRING) return false;
		return this.configService.get<string>(NODE_ENV_ENV_KEY) === NODE_ENV_PRODUCTION;
	}

	public getCookieConfig(scope: UserRole): {
		access: CookieOptions;
		refresh: CookieOptions;
	} {
		this.assertAuthCookieScope(scope);
		const base = this.sharedCookieOptions();
		return {
			access: { ...base, maxAge: this.accessTokenMaxAgeMs() },
			refresh: { ...base, maxAge: this.refreshTokenMaxAgeMs() },
		};
	}

	public getClearCookieOptions(scope: UserRole): Pick<CookieOptions, 'path' | 'domain' | 'sameSite' | 'secure'> {
		this.assertAuthCookieScope(scope);
		const base = this.sharedCookieOptions();
		return {
			path: base.path,
			domain: base.domain,
			sameSite: base.sameSite,
			secure: base.secure,
		};
	}

	public getCookieNames(scope: UserRole): { access: string; refresh: string } {
		this.assertAuthCookieScope(scope);
		switch (scope) {
			case UserRole.CANDIDATE:
				return {
					access:
						this.configService.get<string>(CANDIDATE_ACCESS_COOKIE_NAME_ENV_KEY) ||
						DEFAULT_CANDIDATE_ACCESS_COOKIE_NAME,
					refresh:
						this.configService.get<string>(CANDIDATE_REFRESH_COOKIE_NAME_ENV_KEY) ||
						DEFAULT_CANDIDATE_REFRESH_COOKIE_NAME,
				};
			case UserRole.EMPLOYER:
				return {
					access:
						this.configService.get<string>(EMPLOYER_ACCESS_COOKIE_NAME_ENV_KEY) || DEFAULT_EMPLOYER_ACCESS_COOKIE_NAME,
					refresh:
						this.configService.get<string>(EMPLOYER_REFRESH_COOKIE_NAME_ENV_KEY) ||
						DEFAULT_EMPLOYER_REFRESH_COOKIE_NAME,
				};
			default: {
				const exhaustive: never = scope;
				return exhaustive;
			}
		}
	}
}
