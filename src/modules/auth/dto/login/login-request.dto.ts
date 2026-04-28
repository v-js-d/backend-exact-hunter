import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';
import { IsPassword } from '@/common';

export class LoginDto {
	@ApiProperty({
		description: 'Email',
		example: 'test@example.com',
		required: true,
		type: String,
	})
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'Password',
		example: 'password',
		required: true,
		type: String,
	})
	@IsPassword()
	@IsString()
	@IsNotEmpty()
	password!: string;

	@ApiProperty({
		description: 'Role',
		example: UserRole.CANDIDATE,
		required: true,
		type: String,
		enum: UserRole,
	})
	@IsEnum(UserRole)
	role!: UserRole;
}
