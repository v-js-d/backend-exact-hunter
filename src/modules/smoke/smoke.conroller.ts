import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
	SmokeErrorQueryDto,
	SmokeHealthResponseDto,
	SmokeValidateRequestDto,
	SmokeValidateResponseDto,
} from './smoke.dto';
import { SmokeService } from './smoke.service';
import { ApiSuccessResponse } from '@/core/decorators/response/api-success-response.decorator';
import { ApiErrorResponse } from '@/core/decorators/response/api-error-response.decorator';

@ApiTags('smoke')
@Controller('smoke')
export class SmokeController {
	constructor(private readonly smokeService: SmokeService) {}
	@Get('health')
	@ApiSuccessResponse(SmokeHealthResponseDto)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.UNAUTHORIZED])
	health() {
		return this.smokeService.health();
	}

	@ApiSuccessResponse(SmokeValidateResponseDto)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.UNAUTHORIZED])
	@Post('echo')
	validate(@Body() body: SmokeValidateRequestDto) {
		return this.smokeService.validate(body);
	}

	@Get('error')
	@ApiErrorResponse([
		HttpStatus.BAD_REQUEST,
		HttpStatus.UNAUTHORIZED,
		HttpStatus.FORBIDDEN,
		HttpStatus.NOT_FOUND,
		HttpStatus.CONFLICT,
		HttpStatus.INTERNAL_SERVER_ERROR,
	])
	getError(@Query() query: SmokeErrorQueryDto) {
		return this.smokeService.getError(query);
	}
}
