import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getSwaggerConfig, getValidationConfig } from '@core/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	getValidationConfig(app);
	getSwaggerConfig(app);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
