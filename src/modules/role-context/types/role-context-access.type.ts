import { Prisma } from 'generated/prisma/client';

/** Контекст роли с HR-ролью — для проверки сессии / сборки access payload. */
export const ROLE_CONTEXT_WITH_HR_ROLE_INCLUDE = {
	hrRole: true,
} satisfies Prisma.RoleContextInclude;

export type RoleContextWithHrRole = Prisma.RoleContextGetPayload<{
	include: typeof ROLE_CONTEXT_WITH_HR_ROLE_INCLUDE;
}>;
