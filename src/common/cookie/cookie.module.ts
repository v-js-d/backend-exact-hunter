import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthCookieService } from './auth-cookie.service';
import { ConfigCookieService } from './config-cookie.service';

@Module({
	imports: [ConfigModule],
	providers: [ConfigCookieService, AuthCookieService],
	exports: [ConfigCookieService, AuthCookieService],
})
export class CookieModule {}
