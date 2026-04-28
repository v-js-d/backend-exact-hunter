import { Prisma } from 'generated/prisma/client';

/** Единый `include` для загрузки пользователя со всеми контекстами ролей и связями. */
export const USER_WITH_ROLE_CONTEXTS_INCLUDE = {
	roleContexts: {
		include: {
			hrRole: true,
			company: true,
		},
	},
} satisfies Prisma.UserInclude;

export type UserWithRoleContexts = Prisma.UserGetPayload<{
	include: typeof USER_WITH_ROLE_CONTEXTS_INCLUDE;
}>;
