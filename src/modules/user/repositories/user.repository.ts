import { User } from 'generated/prisma/client';
import { ICreateUser } from '../types/user.type';
import { UserWithRoleContexts } from '../types/user-with-role-contexts.type';

export abstract class UserRepository {
	abstract findById(id: string): Promise<User | null>;
	abstract findByEmail(email: string): Promise<User | null>;
	abstract findByIdWithRoleContexts(id: string): Promise<UserWithRoleContexts | null>;
	abstract findByEmailWithRoleContexts(email: string): Promise<UserWithRoleContexts | null>;
	abstract create(user: ICreateUser): Promise<User>;
	abstract update(id: string, user: Partial<User>): Promise<User>;
	abstract delete(id: string): Promise<boolean>;
}
