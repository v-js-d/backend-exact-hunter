import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './services/mail.service';
import { EmailTestController } from './controllers/email-test.controller';
import { MailTestService } from './services/mail-test.service';
import { MailConfigService } from './services/mail-config.service';
import { getMailerConfig } from '@/core/config';

@Global()
@Module({
	controllers: [EmailTestController],
	imports: [
		ConfigModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService],
		}),
	],
	providers: [MailService, MailConfigService, MailTestService],
	exports: [MailService],
})
export class MailModule {}
