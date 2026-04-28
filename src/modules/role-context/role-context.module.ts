import { Module } from '@nestjs/common';
import { RoleContextPrismaRepository } from './repositories/role-context.prisma.repository';
import { RoleContextRepository } from './repositories/role-context.repository';
import { RoleContextService } from './services/role-context.service';

@Module({
	providers: [
		RoleContextService,
		{
			provide: RoleContextRepository,
			useClass: RoleContextPrismaRepository,
		},
	],
	exports: [RoleContextService],
})
export class RoleContextModule {}
