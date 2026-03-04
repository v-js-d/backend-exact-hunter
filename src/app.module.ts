import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './modules/test/test.module';

@Module({
	imports: [
		TestModule,
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				PORT: Joi.number().port().default(3000),
			}),
			validationOptions: {
				allowUnknown: true,
				abortEarly: false,
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
