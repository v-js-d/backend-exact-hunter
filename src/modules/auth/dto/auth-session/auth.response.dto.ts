import { ApiProperty } from '@nestjs/swagger';

import { AuthTokenPair } from '@/common/auth';

import { AuthSessionUserDto } from './auth-session-user.dto';

export class AuthResponseDto {
	@ApiProperty({ type: () => AuthSessionUserDto })
	user!: AuthSessionUserDto;

	/**
	 * Токены не попадают во фронт в JSON — их отрезает интерцептор, куки ставятся отдельно.
	 */
	tokens!: AuthTokenPair;
}
