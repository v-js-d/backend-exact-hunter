import { UserRole } from 'generated/prisma/enums';

export interface IUser {
	id: string;
	role: UserRole;
}

export interface ICreateUser {
	email: string;
	password: string;
	role: UserRole;
}
