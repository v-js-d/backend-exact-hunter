import { randomUUID } from 'crypto';
import { CompanyType, PrismaClient } from 'generated/prisma/client';

export const seedCompanyTypes = async (prismaClient: PrismaClient) => {
	// eslint-disable-next-line no-console
	console.log(`Seeding CompanyTypes`);

	const companyTypes: CompanyType[] = [
		{
			id: randomUUID(),
			name: 'ORGANIZATION',
			slug: 'organization',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: randomUUID(),
			name: 'IP',
			slug: 'ip',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: randomUUID(),
			name: 'LAWYER',
			slug: 'lawyer',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: randomUUID(),
			name: 'SELF_EMPLOYED',
			slug: 'self_employed',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: randomUUID(),
			name: 'OTHER',
			slug: 'other',
			description: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	await Promise.all(
		companyTypes.map(async (type) => {
			const existing = await prismaClient.companyType.findFirst({ where: { name: type.name } });

			if (existing) {
				await prismaClient.companyType.update({
					where: { id: existing.id },
					data: {
						name: existing.name,
						slug: existing.slug,
						isActive: existing.isActive,
						description: existing.description,
					},
				});
				return Promise.resolve();
			}

			await prismaClient.companyType.create({
				data: type,
			});
			return Promise.resolve();
		}),
	);

	// eslint-disable-next-line no-console
	console.log(`CompanyTypes seeded`);
};
