import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthLogoutResponseDto } from '../dto/auth-logout.response.dto';
import { AuthMeResponseDto } from '../dto/auth-me.response.dto';
import { AuthSessionRequestDto } from '../dto/auth-session.request.dto';
import { AuthSessionResponseDto } from '../dto/auth-session.response.dto';
import { AuthService } from '../services/auth.service';
import type { AuthenticatedUser } from '../types/authenticated-user.type';
import { ApiErrorResponse, ApiSuccessResponse, AuthAccess, CurrentUser, SetAuthCookie } from '@/common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@SetAuthCookie() //устанавливает токены в куки, удаляет их из ответа
	@HttpCode(HttpStatus.OK)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
	@ApiSuccessResponse(AuthSessionResponseDto)
	async login(@Body() body: AuthSessionRequestDto, @Req() request: Request): Promise<AuthSessionResponseDto> {
		return await this.authService.login(body, request);
	}

	@Post('refresh')
	@SetAuthCookie() //устанавливает токены в куки, удаляет их из ответа
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Сессия обновлена, в ответе Set-Cookie с новой парой' })
	@ApiErrorResponse([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
	async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ ok: true }> {
		return await this.authService.refresh(request, response);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@AuthAccess()
	@ApiSuccessResponse(AuthLogoutResponseDto)
	@ApiErrorResponse([HttpStatus.INTERNAL_SERVER_ERROR])
	async logout(
		@CurrentUser() currentUser: AuthenticatedUser,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<AuthLogoutResponseDto> {
		await this.authService.logout(currentUser, request, response);
		return { ok: true };
	}

	@Get('me')
	@AuthAccess()
	@ApiSuccessResponse(AuthMeResponseDto)
	@ApiErrorResponse([HttpStatus.INTERNAL_SERVER_ERROR])
	me(@CurrentUser() currentUser: AuthenticatedUser): AuthMeResponseDto {
		return this.authService.me(currentUser);
	}
}
