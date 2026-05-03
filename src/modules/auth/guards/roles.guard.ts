import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthenticatedUser } from '../types/authenticated-user.interface';
import { ROLES_METADATA_KEY } from '@/common/decorators';

/**
 * Пропускает запрос, только если `request.user.currentRole` входит в список,
 * заданный декоратором `@Roles(...)` на хендлере или контроллере. Должен
 * выполняться ПОСЛЕ `AccessJwtGuard` — именно он заполняет `request.user`.
 *
 * Отсутствие `@Roles(...)` (или пустой список) трактуется как «любая
 * авторизованная роль».
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_METADATA_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
		const user = request.user;

		if (!user) {
			throw new UnauthorizedException(EnumAuthError.USER_NOT_FOUND);
		}

		if (!requiredRoles.includes(user.currentRole)) {
			throw new ForbiddenException(EnumAuthError.ROLE_NOT_ALLOWED);
		}

		return true;
	}
}
