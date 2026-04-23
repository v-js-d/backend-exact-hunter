import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { TokenRepository } from './repositories/token.repository';
import { TokenPrismaRepository } from './repositories/token.prisma.repository';

@Module({
	imports: [JwtModule, ConfigModule],
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
