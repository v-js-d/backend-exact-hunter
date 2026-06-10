import { getCorsConfig, getSwaggerConfig, getValidationConfig } from '@core/config';
import { AllExceptionsFilter, ResponseInterceptor } from '@core/response';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';

const DEFAULT_PORT = 3001;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	app.use(cookieParser(configService.get<string>('COOKIE_SECRET') || undefined));
	getCorsConfig(app, configService);
	getSwaggerConfig(app);
	getValidationConfig(app);
	app.useGlobalFilters(app.get(AllExceptionsFilter));
	app.useGlobalInterceptors(new ResponseInterceptor());
	const port = configService.get<number>('PORT') ?? DEFAULT_PORT;
	await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
