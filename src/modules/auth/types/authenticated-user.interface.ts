import { EnumIdentifierType, UserRole } from 'generated/prisma/enums';

/**
 * Минимальное безопасное представление пользователя, кладётся в `request.user`
 * для защищённых эндпоинтов. Заполняется в `AccessJwtStrategy.validate`, чтобы
 * дальше по коду (контроллеры, сервисы, role guards)
 * можно было его использовать без повторных запросов в БД.
 */
export interface AuthenticatedUserProfile {
	id: string;
	email?: string;
	phone?: string;
	identifierType: EnumIdentifierType;
	isActivated: boolean;
}

export interface AuthenticatedUser {
	user: AuthenticatedUserProfile;
	currentRole: UserRole;
	roleContextId: string;
	companyId?: string | null;
	hrRoleName?: string | null;
}
