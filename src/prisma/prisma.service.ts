import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
	constructor(private configService: ConfigService) {
		const connectionString = configService.get<string>('DATABASE_URL');
		const adapter = new PrismaPg({
			connectionString,
		});
		super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onApplicationShutdown() {
		await this.$disconnect();
	}
}
