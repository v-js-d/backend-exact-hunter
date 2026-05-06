import { EnumIdentifierType, UserRole } from 'generated/prisma/enums';

export interface ICreateUser {
	email?: string;
	phone?: string;
	identifierType: EnumIdentifierType;
	password: string;
	role: UserRole;
	activationLink: string;
}
