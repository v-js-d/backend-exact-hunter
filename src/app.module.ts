import {
	AllExceptionsFilter,
	AllExceptionsFilterLogger,
	GlobalExceptionFilter,
	GlobalExceptionFilterLogger,
} from '@core/response';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { CookieModule } from '@/common/cookie';
import { AuthModule } from '@/modules/auth';
import { HealthModule } from '@/modules/health/health.module';
import { MockModule } from '@/modules/mock';
import { SmokeModule } from '@/modules/smoke';
import { TokenModule } from '@/modules/token';
import { UserModule } from '@/modules/user';
import { PrismaModule } from '@/prisma';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().port().required(),
			}),
			validationOptions: {
				allowUnknown: true,
				abortEarly: false,
			},
		}),
		BullModule.forRoot({
			connection: {
				host: 'localhost',
				port: 6379,
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
	],
	providers: [GlobalExceptionFilter, GlobalExceptionFilterLogger, AllExceptionsFilter, AllExceptionsFilterLogger],
})
export class AppModule {}
