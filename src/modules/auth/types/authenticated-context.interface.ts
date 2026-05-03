import { UserRole } from 'generated/prisma/enums';

export interface IAuthBuildPayload {
	userId: string;
	roleContextId: string;
	userRole: UserRole;
}
