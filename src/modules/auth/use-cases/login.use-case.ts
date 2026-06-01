import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';

import { UserService } from '@/modules/user';

import { EnumAuthError } from '../consts/auth.errors';
import { AuthResponseDto } from '../dto/auth-session/auth.response.dto';
import { IdentifyDto } from '../dto/identify/identify.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	async execute(dto: IdentifyDto, request: Request): Promise<AuthResponseDto> {
		const user = await this.userService.findByIdentifier(dto.identifier, dto.type);
		if (!user) {
			throw new UnauthorizedException(EnumAuthError.USER_NOT_FOUND);
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
