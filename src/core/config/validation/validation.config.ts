import { INestApplication, ValidationPipe } from '@nestjs/common';

export const getValidationConfig = (app: INestApplication) => {
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
};
