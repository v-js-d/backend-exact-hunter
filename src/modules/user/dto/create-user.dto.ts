import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class CreateUserDto {
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
	@IsStrongPassword()
	@IsString()
	@IsNotEmpty()
	password!: string;

	@ApiProperty({
		description: 'Role',
		example: 'candidate',
		required: true,
		type: String,
		enum: UserRole,
	})
	@IsEnum(UserRole)
	role!: UserRole;
}
