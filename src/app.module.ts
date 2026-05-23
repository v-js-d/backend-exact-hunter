import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
	AllExceptionsFilter,
	AllExceptionsFilterLogger,
	GlobalExceptionFilter,
	GlobalExceptionFilterLogger,
} from '@core/response';
import { PrismaModule } from './prisma';
import { HealthModule } from '@/modules/health/health.module';
import { MockModule } from '@/modules/mock';
import { AuthModule } from '@/modules/auth';
import { SmokeModule } from '@/modules/smoke';
import { TokenModule } from '@/modules/token';
import { CookieModule } from '@/common/cookie';
import { UserModule } from '@/modules/user';
import { MailModule } from '@/modules/mail';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				PORT: Joi.number().port().required(),
			}),
			validationOptions: {
				allowUnknown: true,
				abortEarly: false,
			},
		}),
		HealthModule,
		SmokeModule,
		MockModule,
		PrismaModule,
		CookieModule,
		TokenModule,
		UserModule,
		AuthModule,
		MailModule,
	],
	providers: [GlobalExceptionFilter, GlobalExceptionFilterLogger, AllExceptionsFilter, AllExceptionsFilterLogger],
})
export class AppModule {}
