import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthenticatedUser } from '../types/authenticated-user.interface';
import { AuthContextService } from '../services/auth-context.service';
import { IAccessTokenPayload, getSecretFromConfig } from '@/modules/token';
import { AuthCookieService } from '@/common/cookie';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
	constructor(
		configService: ConfigService,
		authCookieService: AuthCookieService,
		private readonly authContextService: AuthContextService,
	) {
		const secret = getSecretFromConfig(configService);
		const extractor = (request: Request) => authCookieService.getAccessToken(request) ?? null;
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([extractor]),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	async validate(payload: IAccessTokenPayload): Promise<AuthenticatedUser> {
		return await this.authContextService.buildAuthenticatedUser(payload);
	}
}
