export function getPasswordResetText(expiresInMinutes: number, brandName: string, userName: string) {
	return {
		preview: `Сброс пароля на сайте ${brandName}`,
		heroTitle: `Сброс пароля`,
		heroSubtitle: `Ссылка действует ${expiresInMinutes} минут и одноразовая.`,
		button: 'Установить новый пароль',
		buttonLink: 'Если кнопка не работает, скопируй ссылку в адресную строку:',
		buttonText:
			'Не запрашивал сброс? Проигнорируй письмо — пароль останется прежним. После успешного сброса все активные сессии будут разлогинены.',
		greetings: `Привет, ${userName}! Мы получили запрос на сброс пароля для твоего аккаунта в ${brandName}. Если это ты — нажми кнопку ниже, чтобы задать новый пароль.`,
	};
}
