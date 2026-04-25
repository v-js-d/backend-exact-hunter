import { ConfigService } from '@nestjs/config';
import { EnumTokenConfig } from '../consts/token.consts';

export const getExpiresInFromConfig = (configService: ConfigService): string => {
	const key = EnumTokenConfig.JWT_ACCESS_EXPIRES_IN;
	const expiresIn = configService.getOrThrow<string>(key);
	return expiresIn;
};

export const getSecretFromConfig = (configService: ConfigService): string => {
	const key = EnumTokenConfig.JWT_SECRET;
	const secret = configService.getOrThrow<string>(key);
	return secret;
};

export const getTtlFromConfig = (configService: ConfigService): string => {
	const key = EnumTokenConfig.REFRESH_TOKEN_EXPIRES_IN;
	const ttl = configService.getOrThrow<string>(key);
	return ttl;
};
