import { UserRole } from 'generated/prisma/enums';

export type { AuthTokenPair } from '@/common/auth';

export interface IAccessTokenPayload {
	sub: string;
	roleContextId: string;
	userRole: UserRole;
	companyId?: string | null;
	hrRoleName?: string | null;
}

export interface IRequestMeta {
	deviceId: string;
	deviceName?: string;
	userAgent?: string;
	ipAddress?: string;
}

export interface ISaveTokenParams {
	userId: string;
	roleContextId: string;
	refreshTokenHash: string;
	expiresAt: Date;
	deviceId: string;
	deviceName?: string;
	userAgent?: string;
	ipAddress?: string;
}
