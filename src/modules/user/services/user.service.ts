import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumIdentifierType, User } from 'generated/prisma/client';
import { ICreateUser } from '../types/user.type';
import { UserRepository } from '../repositories/user.repository';
import { UserWithRoleContexts } from '../types/user-with-role-contexts.type';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findById(id: string): Promise<User | null> {
		return await this.userRepository.findById(id);
	}

	async findByIdentifier(identifier: string, type: EnumIdentifierType): Promise<User | null> {
		return await this.userRepository.findByIdentifier(identifier, type);
	}

	async findByIdWithRoleContexts(id: string): Promise<UserWithRoleContexts | null> {
		return await this.userRepository.findByIdWithRoleContexts(id);
	}

	async findByIdentifierWithRoleContexts(
		identifier: string,
		type: EnumIdentifierType,
	): Promise<UserWithRoleContexts | null> {
		return await this.userRepository.findByIdentifierWithRoleContexts(identifier, type);
	}

	async create(user: ICreateUser): Promise<User> {
		return await this.userRepository.create(user);
	}
	async activateUser(link: string): Promise<UserWithRoleContexts> {
		return await this.userRepository.activateUser(link);
	}

	async update(id: string, user: Partial<User>): Promise<User> {
		return await this.userRepository.update(id, user);
	}
	async delete(id: string): Promise<void> {
		const deleted = await this.userRepository.delete(id);
		if (!deleted) {
			throw new NotFoundException('USER_NOT_FOUND');
		}
	}
}
