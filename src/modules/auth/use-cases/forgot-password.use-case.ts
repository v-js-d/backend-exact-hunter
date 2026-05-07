import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnumIdentifierType } from 'generated/prisma/enums';
import { ForgotPasswordDto } from '../dto/password/forgot-password.dto';
import { MailService } from '@/modules/mail';
import { UserService } from '@/modules/user';

/**
 * Запрос письма со ссылкой сброса пароля.
 * При отсутствии пользователя с таким email ответ контроллера всё равно «успех».
 */
@Injectable()
export class ForgotPasswordUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService,
	) {}

	async execute(dto: ForgotPasswordDto): Promise<void> {
		const email = dto.email.trim().toLowerCase();
		const user = await this.userService.findByIdentifier(email, EnumIdentifierType.EMAIL);

		if (!user?.email) {
			return;
		}

		const resetToken = randomUUID();
		const expiresMinutes = Number(this.configService.get<string>('PASSWORD_RESET_EXPIRY_MINUTES') ?? 30) || 30;
		const passwordResetExpires = new Date(Date.now() + expiresMinutes * 60 * 1000);

		await this.userService.update(user.id, {
			passwordResetToken: resetToken,
			passwordResetExpires,
		});
		//TODO: переделать на имя из профайла или имя hr когда будут сделаны профайлы
		const name = user.email.split('@')[0] ?? user.email;

		await this.mailService.sendPasswordReset({
			email: user.email,
			name,
			resetToken,
			expiresInMinutes: expiresMinutes,
		});
	}
}
