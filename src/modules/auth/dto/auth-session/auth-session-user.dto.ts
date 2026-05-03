import { ApiProperty } from '@nestjs/swagger';
import { EnumIdentifierType, UserRole } from 'generated/prisma/enums';

/** Публичные поля пользователя в ответах login / register / refresh (без токенов). */
export class AuthSessionUserDto {
	@ApiProperty({
		format: 'uuid',
		description: 'ID пользователя',
		example: 'a57fdb76-2480-4d15-a3ee-1a79eb9ca4f0',
		type: String,
		required: true,
	})
	id!: string;

	@ApiProperty({
		format: 'email',
		description: 'Email пользователя',
		example: 'test@example.com',
		type: String,
		nullable: true,
		required: false,
	})
	email?: string;

	@ApiProperty({
		format: 'phone',
		description: 'Телефон пользователя',
		example: '+79999999999',
		type: String,
		nullable: true,
		required: false,
	})
	phone?: string;

	@ApiProperty({
		enum: EnumIdentifierType,
		enumName: 'EnumIdentifierType',
		description: 'Тип идентификатора пользователя',
		example: EnumIdentifierType.EMAIL,
		type: EnumIdentifierType,
		required: true,
	})
	identifierType!: EnumIdentifierType;

	@ApiProperty({
		enum: UserRole,
		enumName: 'UserRole',
		description: 'Роль пользователя',
		example: UserRole.CANDIDATE,
		type: UserRole,
		required: true,
	})
	role!: UserRole;

	@ApiProperty({
		description: 'Активирован ли пользователь',
		example: true,
		type: Boolean,
	})
	isActivated!: boolean;
}
