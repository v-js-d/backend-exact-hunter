import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/enums';

export class AuthMeResponseDto {
	@ApiProperty({
		type: String,
		format: 'uuid',
		description: 'ID пользователя',
		example: 'a57fdb76-2480-4d15-a3ee-1a79eb9ca4f0',
	})
	id!: string;

	@ApiProperty({
		type: String,
		format: 'email',
		description: 'Email пользователя',
		example: 'user@example.com',
	})
	email!: string;

	@ApiProperty({
		type: String,
		enum: UserRole,
		enumName: 'UserRole',
		description: 'Роль пользователя из access контекста',
		example: UserRole.EMPLOYER,
	})
	role!: UserRole;
}
