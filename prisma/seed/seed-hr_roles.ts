import { randomUUID } from 'crypto';
import { HrRole, Prisma, PrismaClient } from 'generated/prisma/client';

export const seedHrRoles = async (prismaClient: PrismaClient) => {
	// eslint-disable-next-line no-console
	console.log(`Seeding HrRoles`);

	const hrRoles: HrRole[] = [
		{
			id: randomUUID(),
			name: 'HR',
			slug: 'hr',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			permissions: null,
		},
		{
			id: randomUUID(),
			name: 'HR_ADMIN',
			slug: 'hr-admin',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			permissions: null,
		},
	];

	await Promise.all(
		hrRoles.map(async (role) => {
			const existing = await prismaClient.hrRole.findFirst({ where: { name: role.name } });

			if (existing) {
				await prismaClient.hrRole.update({
					where: { id: existing.id },
					data: {
						name: existing.name,
						slug: existing.slug,
						isActive: existing.isActive,
						description: existing.description,
						permissions: existing.permissions === null ? Prisma.JsonNull : existing.permissions,
					},
				});
				return Promise.resolve();
			}

			await prismaClient.hrRole.create({
				data: { ...role, permissions: role.permissions === null ? Prisma.JsonNull : role.permissions },
			});
			return Promise.resolve();
		}),
	);

	// eslint-disable-next-line no-console
	console.log(`HrRoles seeded`);
};
