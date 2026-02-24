import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

export const getSwaggerConfig = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle('Exact Hunter backend')
		.setDescription('API for exact hunter backend')
		.setVersion('1.0')
		.addTag('exact-hunter')
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => {
			const cleanController = controllerKey.replace(/Controller$/i, '');
			return `${cleanController}_${methodKey}`;
		},
	};
	const documentFactory = () => SwaggerModule.createDocument(app, config, options);

	SwaggerModule.setup('docs', app, documentFactory);
};
