import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from './roles.decorator';
import { AccessJwtGuard } from '@/modules/auth/guards/access-jwt.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

/**
 * Композитный декоратор для защищённых эндпоинтов.
 *
 *  - Подключает `AccessJwtGuard` (cookie-only access JWT; при 401 с истёкшим access
 *    фронт обновляет сессию через `POST /auth/refresh`, не в guard).
 *  - Подключает `RolesGuard` и навешивает `@Roles(...)`, если переданы роли.
 *  - Добавляет Swagger-аннотации: cookie-auth + 401 / 403.
 *
 * Использование:
 *   `@AuthAccess()` — любой авторизованный пользователь;
 *   `@AuthAccess(UserRole.CANDIDATE)` — только кандидаты;
 *   `@AuthAccess(UserRole.EMPLOYER)` — только работодатели;
 *   `@AuthAccess(UserRole.CANDIDATE, UserRole.EMPLOYER)` — любая из ролей.
 *
 * Для частых случаев есть шорткаты: {@link CandidateAccess}, {@link EmployerAccess}.
 */
export function AuthAccess(...roles: UserRole[]) {
	return applyDecorators(
		UseGuards(AccessJwtGuard, RolesGuard),
		Roles(...roles),
		ApiCookieAuth(),
		ApiUnauthorizedResponse({ description: 'Unauthorized' }),
		ApiForbiddenResponse({ description: 'Forbidden (role not allowed)' }),
	);
}

/**
 * Шорткат над `AuthAccess(UserRole.CANDIDATE)`.
 * Пускает на эндпоинт только пользователя с активным контекстом-кандидатом.
 */
export const CandidateAccess = (): ReturnType<typeof AuthAccess> => AuthAccess(UserRole.CANDIDATE);

/**
 * Шорткат над `AuthAccess(UserRole.EMPLOYER)`.
 * Пускает на эндпоинт только пользователя с активным контекстом-работодателем.
 */
export const EmployerAccess = (): ReturnType<typeof AuthAccess> => AuthAccess(UserRole.EMPLOYER);
