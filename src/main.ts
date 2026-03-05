import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getSwaggerConfig, getValidationConfig } from '@core/config';
import { AppModule } from '@/app.module';
const DEFAULT_PORT = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	getSwaggerConfig(app);
	getValidationConfig(app);

	const port = configService.get<number>('PORT');

	await app.listen(port ?? DEFAULT_PORT);
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
