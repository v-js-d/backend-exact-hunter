import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('PORT');

	await app.listen(port ?? 3000);
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Bootstrap failed', err);
	process.exit(1);
});
