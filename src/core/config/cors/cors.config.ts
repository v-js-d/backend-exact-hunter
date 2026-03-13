import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (app: INestApplication, configService: ConfigService): void => {
	const origin = configService.get<string>('CORS_ORIGIN') ?? '*';
	const corsOptions: CorsOptions = {
		origin: origin?.split(',').map((origin) => origin.trim()),
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	};
	app.enableCors(corsOptions);
};
