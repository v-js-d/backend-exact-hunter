import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from '@/modules/test/test.module';
import { SmokeModule } from '@/modules/smoke/smoke.module';

@Module({
	imports: [
		TestModule,
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				PORT: Joi.number().port().required(),
			}),
			validationOptions: {
				allowUnknown: true,
				abortEarly: false,
			},
		}),
		SmokeModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
