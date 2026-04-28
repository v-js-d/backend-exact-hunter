import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { LoginResponseDto } from '../dto/login/login-response.dto';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthSessionRequestDto } from '../dto/auth-session/auth-session.request.dto';
import { AuthContextService } from '../services/auth-context.service';
import { AuthRequestMetaService } from '../services/auth-request-meta.service';
import { LoginDto } from '../dto/login/login-request.dto';
import { RoleContextService } from '@/modules/role-context';
import { TokenService } from '@/modules/token';
import { UserService } from '@/modules/user';

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly roleContextService: RoleContextService,
		private readonly authContextService: AuthContextService,
		private readonly authRequestMetaService: AuthRequestMetaService,
		private readonly tokenService: TokenService,
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
		const roleContext = await this.roleContextService.findFirstForUserWithHrRole(user.id, dto.role);
		if (!roleContext) {
			throw new UnauthorizedException(EnumAuthError.ROLE_NOT_FOUND);
		}
		if (roleContext.userRole !== dto.role) {
			//пытается зайти как одна роль, но он на самом деле другая роль
			//сейчас у нас один user = одна роль
			//если будем менять - тут надо будет изменить
			throw new UnauthorizedException(EnumAuthError.ROLE_NOT_ALLOWED);
		}
		const buildData: AuthSessionRequestDto = {
			roleContextId: roleContext.id,
			userId: user.id,
			userRole: roleContext.userRole,
		};
		const payload = await this.authContextService.buildAccessPayload(buildData);
		const requestMeta = this.authRequestMetaService.fromRequest(request);
		const pair = await this.tokenService.generateTokenPair(payload, requestMeta);

		return {
			tokens: pair,
			user: {
				id: user.id,
				email: user.email,
				role: roleContext.userRole,
				isActivated: user.isActivated,
			},
		};
	}
}
