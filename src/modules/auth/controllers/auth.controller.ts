import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthLogoutResponseDto } from '../dto/logout/auth-logout.response.dto';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { AuthService } from '../services/auth.service';
import type { AuthenticatedUser } from '../types/authenticated-user.interface';
import { AuthResponseDto } from '../dto/auth-session/auth.response.dto';
import { IdentifyDto } from '../dto/identify/identify.dto';
import { MeResponseDto } from '../dto/me/me-response.dto';
import { ApiErrorResponse, ApiSuccessResponse, AuthAccess, CurrentUser, SetAuthCookie } from '@/common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly registerUseCase: RegisterUseCase,
		private readonly loginUseCase: LoginUseCase,
	) {}

	@Post('register')
	@SetAuthCookie() //устанавливает токены в куки, удаляет их из ответа
	@HttpCode(HttpStatus.CREATED)
	@ApiErrorResponse([
		HttpStatus.BAD_REQUEST,
		HttpStatus.CONFLICT,
		HttpStatus.UNAUTHORIZED,
		HttpStatus.INTERNAL_SERVER_ERROR,
	])
	@ApiSuccessResponse(AuthResponseDto)
	async register(@Body() body: IdentifyDto, @Req() request: Request): Promise<AuthResponseDto> {
		return await this.registerUseCase.execute(body, request);
	}

	@Post('login')
	@SetAuthCookie() //устанавливает токены в куки, удаляет их из ответа
	@HttpCode(HttpStatus.OK)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
	@ApiSuccessResponse(AuthResponseDto)
	async login(@Body() body: IdentifyDto, @Req() request: Request): Promise<AuthResponseDto> {
		return await this.loginUseCase.execute(body, request);
	}

	@Post('refresh')
	@SetAuthCookie() //устанавливает токены в куки, удаляет их из ответа
	@HttpCode(HttpStatus.OK)
	@ApiSuccessResponse(AuthResponseDto)
	@ApiErrorResponse([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
	async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {
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
	@ApiSuccessResponse(MeResponseDto)
	@ApiErrorResponse([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
	me(@CurrentUser() current: AuthenticatedUser): MeResponseDto {
		return this.authService.me(current);
	}

	@Delete('delete/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Удаление пользователя (временно для тестов)',
		description:
			'Удаляет строку `users`. Связанные `role_contexts`, `tokens` и т.д. снимаются каскадом в БД (см. `onDelete` в Prisma), отдельно вызывать RoleContext не нужно.',
	})
	@ApiParam({ name: 'id', description: 'UUID пользователя', example: '123e4567-e89b-12d3-a456-426614174000' })
	@ApiOkResponse({
		description: 'Успех. Глобальный ResponseInterceptor оборачивает в `{ "result": true }`.',
		schema: {
			type: 'object',
			properties: { result: { type: 'boolean', example: true } },
			required: ['result'],
		},
	})
	@ApiBadRequestResponse({ description: 'Невалидный UUID в path' })
	@ApiNotFoundResponse({ description: 'Пользователь не найден' })
	@ApiErrorResponse([HttpStatus.INTERNAL_SERVER_ERROR])
	async delete(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
		return await this.authService.delete(id);
	}
}
