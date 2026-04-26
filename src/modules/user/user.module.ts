import { Module } from '@nestjs/common';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
	providers: [
		UserService,
		{
			provide: UserRepository,
			useClass: UserPrismaRepository,
		},
	],
	exports: [UserService],
})
export class UserModule {}
