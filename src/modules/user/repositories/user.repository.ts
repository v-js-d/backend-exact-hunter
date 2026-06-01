import { EnumIdentifierType, User } from 'generated/prisma/client';

import { UserWithRoleContexts } from '../types/user-with-role-contexts.type';
import { ICreateUser } from '../types/user.type';

export abstract class UserRepository {
	abstract findById(id: string): Promise<User | null>;
	abstract findByIdentifier(identifier: string, type: EnumIdentifierType): Promise<User | null>;
	abstract findByIdWithRoleContexts(id: string): Promise<UserWithRoleContexts | null>;
	abstract findByIdentifierWithRoleContexts(
		identifier: string,
		type: EnumIdentifierType,
	): Promise<UserWithRoleContexts | null>;
	abstract create(user: ICreateUser): Promise<User>;
	abstract update(id: string, user: Partial<User>): Promise<User>;
	abstract delete(id: string): Promise<boolean>;
}
