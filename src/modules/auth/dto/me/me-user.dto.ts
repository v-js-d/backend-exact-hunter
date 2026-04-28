import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/enums';

/** Профиль для GET /auth/me (из JWT + контекста, без лишнего запроса к БД). */
export class MeUserDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ format: 'email' })
	email!: string;

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
	role!: UserRole;

	@ApiProperty({
		nullable: true,
		description: 'Имя HR-роли из role context (если есть)',
	})
	userRoleName!: string | null;

	@ApiProperty()
	isActivated!: boolean;
}
