import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getCorsConfig, getSwaggerConfig, getValidationConfig } from '@core/config';
import { GlobalExceptionFilter, ResponseInterceptor } from '@core/response';
import { AppModule } from '@/app.module';
const DEFAULT_PORT = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	getCorsConfig(app, configService);
	getSwaggerConfig(app);
	getValidationConfig(app);
	app.useGlobalFilters(app.get(GlobalExceptionFilter));
	app.useGlobalInterceptors(new ResponseInterceptor());
	const port = configService.get<number>('PORT');

	await app.listen(port ?? DEFAULT_PORT);
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
