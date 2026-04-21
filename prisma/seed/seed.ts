import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedHrRoles } from './seed-hr_roles';
import { seedCompanyTypes } from './seed-company_types';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async () => {
	try {
		await seedHrRoles(prisma);
		await seedCompanyTypes(prisma);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

void main();
