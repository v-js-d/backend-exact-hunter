import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumIdentifierType, UserRole } from 'generated/prisma/enums';
import { IsPassword } from '@/common';
import { IsIdentifier } from '@/common/decorators/validation/identifier-validation.decorator';

export class IdentifyDto {
	@ApiProperty({
		example: '+78008080800',
		required: true,
		type: String,
	})
	@IsString()
	@IsIdentifier()
	identifier!: string;

	@ApiProperty({
		example: EnumIdentifierType.PHONE,
		enum: EnumIdentifierType,
	})
	@IsEnum(EnumIdentifierType)
	type!: EnumIdentifierType;

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
