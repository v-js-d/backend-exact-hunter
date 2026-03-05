import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GlobalExceptionFilter } from '@core/response';
import { GlobalExceptionFilterLogger } from '@core/response/filters/lib/global-exception.log.util';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from '@/modules/test/test.module';
import { SmokeModule } from '@/modules/smoke/smoke.module';

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
	controllers: [AppController],
	providers: [AppService, GlobalExceptionFilter, GlobalExceptionFilterLogger],
})
export class AppModule {}
