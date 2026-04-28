import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma/client';
import { ICreateUser } from '../types/user.type';
import { USER_WITH_ROLE_CONTEXTS_INCLUDE } from '../types/user-with-role-contexts.type';
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

	async findByIdWithRoleContexts(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			include: USER_WITH_ROLE_CONTEXTS_INCLUDE,
		});
	}

	async findByEmailWithRoleContexts(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: USER_WITH_ROLE_CONTEXTS_INCLUDE,
		});
	}

	async create(user: ICreateUser): Promise<User> {
		const data: Prisma.UserCreateInput = {
			email: user.email,
			password: user.password,
			roleContexts: {
				create: {
					userRole: user.role,
				},
			},
		};

		return this.prisma.user.create({ data });
	}

	async update(id: string, user: Partial<User>): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: user,
		});
	}

	async delete(id: string): Promise<boolean> {
		await this.prisma.user.delete({ where: { id } });
		return true;
	}
}
