import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { EnumEmailTextByRoleType } from '../templates/type/text.type';

export class SendMailActivationLinkDto {
	@ApiProperty({ description: 'Email', example: 'test@example.com' })
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@ApiProperty({ description: 'Name', example: 'John Doe' })
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Activation Token',
		example: '1234567890',
	})
	@IsString()
	@IsNotEmpty()
	activationToken!: string;

	@ApiProperty({ description: 'Role', example: 'employer' })
	@IsString()
	@IsNotEmpty()
	role!: EnumEmailTextByRoleType;
}
