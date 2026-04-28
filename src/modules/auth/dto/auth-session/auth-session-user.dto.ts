import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/enums';

/** Публичные поля пользователя в ответах login / register / refresh (без токенов). */
export class AuthSessionUserDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ format: 'email' })
	email!: string;

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
	role!: UserRole;

	@ApiProperty()
	isActivated!: boolean;
}
