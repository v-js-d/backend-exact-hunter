import { ApiProperty } from '@nestjs/swagger';

import { AuthSessionUserDto } from '../auth-session/auth-session-user.dto';

export class MeResponseDto {
	@ApiProperty({ type: () => AuthSessionUserDto })
	user!: AuthSessionUserDto;
}
