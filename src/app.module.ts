import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GlobalExceptionFilter, GlobalExceptionFilterLogger } from '@core/response';

import { TestModule } from '@/modules/test/test.module';
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
		TestModule,
		SmokeModule,
	],

	providers: [GlobalExceptionFilter, GlobalExceptionFilterLogger],
})
export class AppModule {}
