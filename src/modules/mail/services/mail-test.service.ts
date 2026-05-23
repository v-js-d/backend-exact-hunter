import { Injectable } from '@nestjs/common';
import { SendMailActivationLinkDto } from '../dto/activation-link.dto';
import { SendMailPasswordResetDto } from '../dto/password-reset.dto';
import { MailService } from './mail.service';

@Injectable()
export class MailTestService {
	constructor(private readonly mailService: MailService) {}

	async testVerify(dto: SendMailActivationLinkDto) {
		return await this.mailService.sendActivationLink(dto);
	}

	async testReset(dto: SendMailPasswordResetDto) {
		return await this.mailService.sendPasswordReset(dto);
	}
}
