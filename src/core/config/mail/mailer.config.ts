import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	const mode = configService.getOrThrow<string>('NODE_ENV');
	const isProd = mode !== 'development';
	const secure = isProd ? true : false;

	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
			tls: {
				rejectUnauthorized: false,
			},
		},
		defaults: {
			from: ` ${configService.getOrThrow<string>('MAIL_LOGIN')}`,
		},
	};
}
