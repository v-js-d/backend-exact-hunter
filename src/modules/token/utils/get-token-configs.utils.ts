import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

import { EnumTokenConfig } from '../consts/token.consts';

/** Строка вида `15m` / `7d` для access JWT (`signOptions.expiresIn`) и для `ms`. */
export const getExpiresInFromConfig = (configService: ConfigService): StringValue => {
	const expiresIn = configService.getOrThrow<string>(EnumTokenConfig.JWT_ACCESS_EXPIRES_IN);
	return expiresIn as StringValue;
};

export const getSecretFromConfig = (configService: ConfigService): string => {
	const key = EnumTokenConfig.JWT_SECRET;
	const secret = configService.getOrThrow<string>(key);
	return secret;
};

/** Длительность refresh-сессии в миллисекундах (cookie maxAge, expires в БД). */
export const getTtlFromConfig = (configService: ConfigService): number => {
	const ttl = configService.getOrThrow<string>(EnumTokenConfig.REFRESH_TOKEN_EXPIRES_IN);
	const msVal = ms(ttl as StringValue);
	if (typeof msVal !== 'number') {
		throw new Error(`Invalid ${EnumTokenConfig.REFRESH_TOKEN_EXPIRES_IN}`);
	}
	return msVal;
};
