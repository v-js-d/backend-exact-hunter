import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);

	constructor(configService: ConfigService) {
		super({
			username: configService.get<string>('REDIS_USER'),
			password: configService.get<string>('REDIS_PASSWORD'),
			host: configService.get<string>('REDIS_HOST'),
			port: Number(configService.get<string>('REDIS_PORT')),
			lazyConnect: true,
		});
	}

	onModuleInit() {
		const start = Date.now();

		this.logger.log('Initializing Redis connection...');

		this.on('connect', () => {
			this.logger.log('Redis connecting...');
		});

		this.on('ready', () => {
			const ms = Date.now() - start;
			this.logger.log(`Redis connected (time=${ms}ms)`);
		});

		this.on('error', (error) => {
			this.logger.error(`Redis error`, {
				error: error.message ?? error,
			});
		});

		this.on('close', () => {
			this.logger.warn(`Redis connection closed`);
		});

		this.on('reconnecting', () => {
			this.logger.warn(`Redis reconnecting...`);
		});
	}

	async onModuleDestroy() {
		this.logger.log('Closing Redis reconnecting...');

		try {
			await this.quit();

			this.logger.log('Redis connection close');
		} catch (error) {
			this.logger.error('Error closing Redis connection', error);
		}
	}
}
