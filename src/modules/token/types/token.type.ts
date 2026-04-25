export type { AuthTokenPair } from '@/common/auth';

export interface AccessTokenPayload {
	sub: string;
	roleContextId: string;
	userRole: string;
	companyId?: string | null;
	hrRoleName?: string | null;
}

export interface RequestMeta {
	deviceId: string;
	deviceName?: string;
	userAgent?: string;
	ipAddress?: string;
}

export interface SaveTokenParams {
	userId: string;
	roleContextId: string;
	refreshTokenHash: string;
	expiresAt: Date;
	deviceId: string;
	deviceName?: string;
	userAgent?: string;
	ipAddress?: string;
}
