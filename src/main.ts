import { NestFactory } from '@nestjs/core';
import { getSwaggerConfig, getValidationConfig } from '@core/config';
import { AppModule } from '@/app.module';
const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	getSwaggerConfig(app);
	getValidationConfig(app);
	await app.listen(PORT);
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
