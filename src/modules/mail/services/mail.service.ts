import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { render } from 'react-email';
import { EmailVerificationTemplate } from '../templates/email-verification/ui/email-verification.template';
import { PasswordResetTemplate } from '../templates/password-reset/ui/password-reset.template';
import { SendMailActivationLinkDto } from '../dto/activation-link.dto';
import { SendMailPasswordResetDto } from '../dto/password-reset.dto';
import { MailConfig, MailConfigService } from './mail-config.service';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly mailConfig: MailConfig;
	constructor(
		private readonly mailerService: MailerService,
		private readonly mailConfigService: MailConfigService,
	) {
		this.mailConfig = this.mailConfigService.getConfig();
	}

	public async sendActivationLink({ email, name, activationToken, role }: SendMailActivationLinkDto) {
		const { brandName, logoUrl, verificationSubject, clientUrl } = this.mailConfig;
		const activationLink = `${clientUrl}/auth/activate/${activationToken}`;
		const html = await render(
			EmailVerificationTemplate({
				name,
				brandName,
				logoUrl,
				activationLink,
				role,
			}),
		);

		await this.sendEmail({
			subject: verificationSubject,
			html: html,
			to: [email],
			context: {
				name: name,
			},
		});
		return true;
	}

	public async sendPasswordReset({ email, name, resetToken, expiresInMinutes }: SendMailPasswordResetDto) {
		const { clientUrl, brandName, logoUrl, passwordResetSubject } = this.mailConfig;
		const resetLink = `${clientUrl}/auth/reset-password/${resetToken}`;
		const html = await render(
			PasswordResetTemplate({
				name,
				resetLink,
				brandName,
				logoUrl,
				clientUrl,
				expiresInMinutes,
			}),
		);

		await this.sendEmail({
			subject: passwordResetSubject,
			html,
			to: [email],
			context: { name },
		});
		return true;
	}

	async sendEmail(params: {
		subject: string;
		html: string;
		to: string[];
		context: ISendMailOptions['context'];
		attachments?: Array<{
			filename: string;
			content: Buffer;
			cid?: string;
			contentType: string;
		}>;
	}) {
		try {
			const { from } = this.mailConfig;

			const emailsList: string[] = params.to;

			if (!emailsList) {
				throw new Error(`No recipients found in SMTP_TO env var, please check your .env file`);
			}

			const sendMailParams: ISendMailOptions = {
				to: emailsList,
				from: from,
				subject: params.subject,
				html: params.html,
				attachments: params.attachments,
			};
			const response = (await this.mailerService.sendMail(sendMailParams)) as Record<string, unknown>;
			return {
				...response,

				message: 'Email sent successfully',
			};
		} catch (error) {
			this.logger.error(
				`Error while sending mail with the following parameters : ${JSON.stringify(params)}`,
				error instanceof Error ? error.stack : JSON.stringify(error),
			);
		}
	}
}
