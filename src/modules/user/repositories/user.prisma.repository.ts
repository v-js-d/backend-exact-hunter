import { Injectable } from '@nestjs/common';
import { EnumIdentifierType, Prisma, User } from 'generated/prisma/client';
import { ICreateUser } from '../types/user.type';
import { USER_WITH_ROLE_CONTEXTS_INCLUDE, UserWithRoleContexts } from '../types/user-with-role-contexts.type';
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
	async findByIdentifier(identifier: string, type: EnumIdentifierType): Promise<User | null> {
		const identifierWhere: Prisma.UserWhereUniqueInput =
			type === EnumIdentifierType.EMAIL ? { email: identifier } : { phone: identifier };
		return this.prisma.user.findUnique({
			where: identifierWhere,
		});
	}

	async findByIdWithRoleContexts(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			include: USER_WITH_ROLE_CONTEXTS_INCLUDE,
		});
	}

	async findByIdentifierWithRoleContexts(
		identifier: string,
		type: EnumIdentifierType,
	): Promise<UserWithRoleContexts | null> {
		const identifierWhere: Prisma.UserWhereUniqueInput =
			type === EnumIdentifierType.EMAIL ? { email: identifier } : { phone: identifier };
		return this.prisma.user.findUnique({
			where: identifierWhere,
			include: USER_WITH_ROLE_CONTEXTS_INCLUDE,
		});
	}

	async create(user: ICreateUser): Promise<User> {
		const data: Prisma.UserCreateInput = {
			email: user.email,
			phone: user.phone,
			identifierType: user.identifierType,
			password: user.password,
			isActivated: false,
			activationLink: user.activationLink,
			emailVerifiedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			roleContexts: {
				create: {
					userRole: user.role,
				},
			},
		};

		return this.prisma.user.create({ data });
	}

	async activateUser(link: string): Promise<UserWithRoleContexts> {
		return await this.prisma.user.update({
			where: { activationLink: link },
			data: {
				isActivated: true,
				activationLink: null,
				emailVerifiedAt: new Date(),
				updatedAt: new Date(),
			},
			include: USER_WITH_ROLE_CONTEXTS_INCLUDE,
		});
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
