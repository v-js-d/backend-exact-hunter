import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_DESCRIPTION, SWAGGER_PATH, SWAGGER_TAG, SWAGGER_TITLE, SWAGGER_VERSION } from './swagger.consts';

export const getSwaggerConfig = (app: INestApplication): void => {
	const config = new DocumentBuilder()
		.setTitle(SWAGGER_TITLE)
		.setDescription(SWAGGER_DESCRIPTION)
		.setVersion(SWAGGER_VERSION)
		.addTag(SWAGGER_TAG)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'JWT access token',
			},
			'bearer',
		)
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => {
			const cleanController = clearControllerName(controllerKey);
			return `${cleanController}_${methodKey}`;
		},
	};

	const documentFactory = () => SwaggerModule.createDocument(app, config, options);
	SwaggerModule.setup(SWAGGER_PATH, app, documentFactory());
};

const clearControllerName = (controllerKey: string): string => {
	const cleanController = controllerKey.replace(/Controller$/i, '');
	return cleanController;
};
