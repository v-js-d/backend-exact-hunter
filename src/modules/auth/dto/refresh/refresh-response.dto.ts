import { ApiProperty } from '@nestjs/swagger';
import { AuthSessionUserDto } from '../auth-session/auth-session-user.dto';

export class RefreshResponseDto {
	@ApiProperty({ type: () => AuthSessionUserDto })
	user!: AuthSessionUserDto;

	@ApiProperty({ example: true })
	ok!: true;
}
