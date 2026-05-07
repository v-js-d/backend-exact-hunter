import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MailConfig {
	logoUrl: string;
	brandName: string;
	clientUrl: string;
	from: string;
	verificationSubject: string;
	passwordResetSubject: string;
}
@Injectable()
export class MailConfigService {
	constructor(private readonly configService: ConfigService) {}

	public getConfig(): MailConfig {
		const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
		const logoUrl = this.configService.getOrThrow<string>('LOGO_URL');
		const brandName = this.configService.getOrThrow<string>('BRAND_NAME');
		const mailLogin = this.configService.getOrThrow<string>('MAIL_LOGIN');
		const from = `${brandName}. <${mailLogin}>`;
		const verificationSubject = `Активация аккаунта на сайте ${brandName}`;
		const passwordResetSubject = `Сброс пароля на сайте ${brandName}`;
		return {
			logoUrl,
			brandName,
			clientUrl,
			from,
			verificationSubject,
			passwordResetSubject,
		};
	}
}
