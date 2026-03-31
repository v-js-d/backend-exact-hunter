import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GlobalExceptionFilter, GlobalExceptionFilterLogger } from '@core/response';
import { PrismaModule } from './prisma';
import { HealthModule } from '@/modules/health/health.module';
import { SmokeModule } from '@/modules/smoke/';

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
		PrismaModule,
	],
	providers: [GlobalExceptionFilter, GlobalExceptionFilterLogger],
})
export class AppModule {}
