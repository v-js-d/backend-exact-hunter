import { Injectable } from '@nestjs/common';
import { Token } from 'generated/prisma/client';

import { PrismaService } from '@/prisma';

import { TokenRepository } from './token.repository';

import { ISaveTokenParams } from '../types/token.type';

@Injectable()
export class TokenPrismaRepository implements TokenRepository {
	constructor(private readonly prisma: PrismaService) {}

	async save(params: ISaveTokenParams): Promise<Token> {
		const existing = await this.findByUserAndDevice(params.userId, params.roleContextId, params.deviceId);

		if (existing) {
			return this.prisma.token.update({
				where: { id: existing.id },
				data: {
					refreshToken: params.refreshTokenHash,
					expiresAt: params.expiresAt,
					deviceName: params.deviceName,
					userAgent: params.userAgent,
					ipAddress: params.ipAddress,
				},
			});
		}

		return this.prisma.token.create({
			data: {
				userId: params.userId,
				roleContextId: params.roleContextId,
				refreshToken: params.refreshTokenHash,
				deviceId: params.deviceId,
				deviceName: params.deviceName,
				userAgent: params.userAgent,
				ipAddress: params.ipAddress,
				expiresAt: params.expiresAt,
			},
		});
	}

	async findByUserAndDevice(userId: string, roleContextId: string, deviceId: string): Promise<Token | null> {
		return await this.prisma.token.findFirst({
			where: { userId, roleContextId, deviceId },
		});
	}

	async findById(id: string): Promise<Token | null> {
		return await this.prisma.token.findUnique({ where: { id } });
	}

	async deleteById(id: string): Promise<Token> {
		return await this.prisma.token.delete({ where: { id } });
	}

	async deleteAllByUserId(userId: string): Promise<number> {
		const result = await this.prisma.token.deleteMany({ where: { userId } });
		return result.count;
	}
}
