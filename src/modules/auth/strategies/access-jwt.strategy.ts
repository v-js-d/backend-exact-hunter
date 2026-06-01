import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthCookieService } from '@/common/cookie';
import { getSecretFromConfig, IAccessTokenPayload } from '@/modules/token';

import { AuthContextService } from '../services/auth-context.service';
import { AuthenticatedUser } from '../types/authenticated-user.interface';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
	constructor(
		configService: ConfigService,
		authCookieService: AuthCookieService,
		private readonly authContextService: AuthContextService,
	) {
		const secret = getSecretFromConfig(configService);
		const extractor = (request: Request) => authCookieService.getAccessToken(request) ?? null;
		// Сначала Bearer (Swagger UI / curl), затем access-кука (браузер).
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), extractor]),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	async validate(payload: IAccessTokenPayload): Promise<AuthenticatedUser> {
		return await this.authContextService.buildAuthenticatedUser(payload);
	}
}
