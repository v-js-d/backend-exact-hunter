import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthLogoutResponseDto } from '../dto/auth-logout.response.dto';
import { AuthSessionRequestDto } from '../dto/auth-session.request.dto';
import { AuthSessionResponseDto } from '../dto/auth-session.response.dto';
import { AuthService } from '../services/auth.service';
import { AuthCookieService, EnumCookieError } from '@/common/cookie';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly cookieService: AuthCookieService,
	) {}

	@Post('login')
	@ApiBody({ type: AuthSessionRequestDto })
	@ApiOkResponse({ type: AuthSessionResponseDto })
	async login(
		@Body() dto: AuthSessionRequestDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthSessionResponseDto> {
		const pair = await this.authService.login(dto, request);
		this.cookieService.setAccessToken(response, pair.accessToken);
		this.cookieService.setRefreshToken(response, pair.refreshToken);
		return dto;
	}

	@Post('refresh')
	@ApiBody({ type: AuthSessionRequestDto })
	@ApiOkResponse({ type: AuthSessionResponseDto })
	async refresh(
		@Body() dto: AuthSessionRequestDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthSessionResponseDto> {
		const refreshToken = this.cookieService.getRefreshToken(request);
		if (!refreshToken) {
			this.cookieService.clearAuthCookies(response);
			throw new UnauthorizedException(EnumCookieError.REFRESH_COOKIE_MISSING);
		}

		try {
			const pair = await this.authService.refresh(dto, refreshToken, request);
			this.cookieService.setAccessToken(response, pair.accessToken);
			this.cookieService.setRefreshToken(response, pair.refreshToken);
			return dto;
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				// Mandatory contract: refresh 401 always clears auth cookies.
				this.cookieService.clearAuthCookies(response);
			}
			throw error;
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: AuthSessionRequestDto })
	@ApiOkResponse({ type: AuthLogoutResponseDto })
	async logout(
		@Body() dto: AuthSessionRequestDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthLogoutResponseDto> {
		try {
			await this.authService.logout(dto, request);
		} finally {
			// Mandatory contract: logout always clears both auth cookies.
			this.cookieService.clearAuthCookies(response);
		}
		return { ok: true };
	}
}
