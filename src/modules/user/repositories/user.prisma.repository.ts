import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { UserRepository } from './user.repository';
import { PrismaService } from '@/prisma';

@Injectable()
export class UserPrismaRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}
}
