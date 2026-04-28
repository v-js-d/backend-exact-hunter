import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class AuthSessionRequestDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID пользователя',
		example: 'a57fdb76-2480-4d15-a3ee-1a79eb9ca4f0',
	})
	@IsUUID()
	userId!: string;

	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID role_context',
		example: 'f4bb3803-34ff-4f6e-afde-3a2a5f42f80f',
	})
	@IsUUID()
	roleContextId!: string;

	@ApiProperty({
		type: String,
		enum: UserRole,
		enumName: 'UserRole',
		description: 'Роль контекста (ADMIN пока не поддерживается в cookie-потоке)',
		example: UserRole.CANDIDATE,
	})
	@IsEnum(UserRole)
	userRole!: UserRole;
}
