import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AccessJwtGuard } from './guards/access-jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthContextService } from './services/auth-context.service';
import { AuthRequestMetaService } from './services/auth-request-meta.service';
import { AuthService } from './services/auth.service';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { CookieModule } from '@/common/cookie';
import { TokenModule } from '@/modules/token';
import { PrismaModule } from '@/prisma';
import { UserModule } from '@/modules/user';

@Module({
	imports: [PrismaModule, TokenModule, CookieModule, UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthRequestMetaService,
		AuthContextService,
		AccessJwtStrategy,
		AccessJwtGuard,
		RolesGuard,
		ConfigService,
	],
})
export class AuthModule {}
