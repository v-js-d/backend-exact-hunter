import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AccessTokenPayload, getSecretFromConfig } from '@/modules/token';
import { AuthCookieService } from '@/common/cookie';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService, authCookieService: AuthCookieService) {
		const secret = getSecretFromConfig(configService);
		const extractor = (request: Request) => authCookieService.getAccessToken(request) ?? null;
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([extractor]),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	validate(payload: AccessTokenPayload) {
		return {
			userId: payload.sub,
			roleContextId: payload.roleContextId,
			userRole: payload.userRole,
			companyId: payload.companyId,
			hrRoleName: payload.hrRoleName,
		};
	}
}
