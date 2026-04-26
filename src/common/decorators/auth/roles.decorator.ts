import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

export const ROLES_METADATA_KEY = 'auth:roles';

/**
 * Помечает route-хендлер (или контроллер целиком) как доступный только для
 * перечисленных ролей. Проверка делается `RolesGuard`. Пустой список или
 * отсутствие декоратора = доступ для любого авторизованного пользователя.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_METADATA_KEY, roles);
