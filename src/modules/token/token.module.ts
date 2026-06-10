import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenPrismaRepository } from './repositories/token.prisma.repository';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';
import { getExpiresInFromConfig, getSecretFromConfig } from './utils/get-token-configs.utils';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: getSecretFromConfig(config),
				signOptions: { expiresIn: getExpiresInFromConfig(config) },
			}),
		}),
	],
	providers: [
		TokenService,
		{
			provide: TokenRepository,
			useClass: TokenPrismaRepository,
		},
	],
	exports: [TokenService],
})
export class TokenModule {}
