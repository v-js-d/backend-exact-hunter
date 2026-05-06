import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMailActivationLinkDto } from '../dto/activation-link.dto';
import { SendMailPasswordResetDto } from '../dto/password-reset.dto';
import { MailTestService } from '../services/mail-test.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/common';

@ApiTags('Email Test')
@Controller('email-test')
export class EmailTestController {
	constructor(private readonly mailTestService: MailTestService) {}

	@ApiOperation({ summary: 'Test verify email' })
	@ApiSuccessResponse(SendMailActivationLinkDto)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.UNAUTHORIZED])
	@ApiBody({ type: SendMailActivationLinkDto })
	@Post('test-verify')
	testVerify(@Body() body: SendMailActivationLinkDto) {
		return this.mailTestService.testVerify(body);
	}

	@ApiOperation({ summary: 'Test reset password' })
	@ApiSuccessResponse(SendMailPasswordResetDto)
	@ApiErrorResponse([HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.UNAUTHORIZED])
	@ApiBody({ type: SendMailPasswordResetDto })
	@Post('test-reset')
	testReset(@Body() body: SendMailPasswordResetDto) {
		return this.mailTestService.testReset(body);
	}
}
