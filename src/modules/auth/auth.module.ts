import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { CookieModule } from '@/common/cookie';
import { TokenModule } from '@/modules/token';
import { PrismaModule } from '@/prisma';

@Module({
	imports: [PrismaModule, TokenModule, CookieModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
