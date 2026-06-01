import { INestApplication, ValidationPipe } from '@nestjs/common';

import { ValidationException } from '@/core/response/filters/validation.exception';

export const getValidationConfig = (app: INestApplication) => {
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			exceptionFactory: (errors) => {
				return new ValidationException(errors);
			},
		}),
	);
};
