import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AccessJwtGuard } from './guards/access-jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthContextService } from './services/auth-context.service';
import { AuthIRequestMetaService } from './services/auth-request-meta.service';
import { AuthService } from './services/auth.service';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { CookieModule } from '@/common/cookie';
import { RoleContextModule } from '@/modules/role-context';
import { TokenModule } from '@/modules/token';
import { UserModule } from '@/modules/user';

@Module({
	imports: [ConfigModule, TokenModule, CookieModule, UserModule, RoleContextModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		LoginUseCase,
		RegisterUseCase,
		ForgotPasswordUseCase,
		ResetPasswordUseCase,
		AuthIRequestMetaService,
		AuthContextService,
		AccessJwtStrategy,
		AccessJwtGuard,
		RolesGuard,
	],
})
export class AuthModule {}
