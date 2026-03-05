import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { SmokeValidateRequestDto, SmokeValidateResponseDto } from './smoke.dto';
import { ApiSuccessResponse } from '@/core/decorators/response/api-success-response.decorator';
import { ApiErrorResponse } from '@/core/decorators/response/api-error-response.decorator';
@Controller('smoke')
export class SmokeController {
	@Get()
	smoke() {
		return { status: 'ok' };
	}
	@ApiSuccessResponse(SmokeValidateResponseDto)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.UNAUTHORIZED])
	@Post()
	validate(@Body() body: SmokeValidateRequestDto) {
		return body;
	}
}
