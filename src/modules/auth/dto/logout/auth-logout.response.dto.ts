import { ApiProperty } from '@nestjs/swagger';

export class AuthLogoutResponseDto {
	@ApiProperty({
		description: 'Операция logout выполнена',
		example: true,
		type: Boolean,
	})
	ok!: true;
}
