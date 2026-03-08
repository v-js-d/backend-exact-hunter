import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmokeService } from '../services/smoke.service';
import { SmokeValidateRequestDto } from '../dto/smoke-validate-request.dto';
import { SmokeErrorQueryDto } from '../dto/smoke-error-query.dto';
import { SmokeHealthResponseDto } from '../dto/smoke-health-response.dto';
import { SmokeValidateResponseDto } from '../dto/smoke-validate-response.dto';
import { ApiErrorResponse } from '@/core/decorators/response/api-error-response.decorator';
import { ApiSuccessResponse } from '@/core/decorators/response/api-success-response.decorator';

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
