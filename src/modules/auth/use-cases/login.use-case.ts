import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { LoginResponseDto } from '../dto/login/login-response.dto';
import { EnumAuthError } from '../consts/auth.errors';
import { LoginDto } from '../dto/login/login-request.dto';
import { AuthService } from '../services/auth.service';
import { UserService } from '@/modules/user';

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	async execute(dto: LoginDto, request: Request): Promise<LoginResponseDto> {
		const user = await this.userService.findByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException(EnumAuthError.INVALID_CREDENTIALS);
		}

		const passwordOk = await bcrypt.compare(dto.password, user.password);
		if (!passwordOk) {
			throw new UnauthorizedException(EnumAuthError.INVALID_CREDENTIALS);
		}
		const pair = await this.authService.getAuthenticatedToken(request, user.id, dto.role);
		const authenticatedUserData = this.authService.getAuthenticatedUser(user, dto.role);
		return {
			tokens: pair,
			user: authenticatedUserData,
		};
	}
}
