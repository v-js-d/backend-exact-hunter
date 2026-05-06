import { EnumEmailTextByRoleType } from '../../type/text.type';

export function getEmailVerificationText(roleType: EnumEmailTextByRoleType, brandName: string, userName: string) {
	const { greetings } = getEmailVerificationTextUserByRole(roleType, userName);
	return {
		preview: `Активация аккаунта на сайте ${brandName}`,
		heroTitle: `Добро пожаловать в ${brandName}!`,
		heroSubtitle: 'Подтвердите email, чтобы получить доступ к уникальной платформе для поиска работы и сотрудников.',
		button: 'Активировать аккаунт',
		buttonLink: 'Если кнопка не работает, скопируй ссылку в адресную строку:',
		buttonText: 'Если ты здесь случайно — просто проигнорируй письмо.',
		greetings,
	};
}

export function getEmailVerificationTextUserByRole(roleType: EnumEmailTextByRoleType, userName: string) {
	if (roleType === EnumEmailTextByRoleType.EMPLOYER) {
		return {
			greetings: `Привет, ${userName}! Мы получили запрос на активацию твоего аккаунта. Это последний шаг — подтверди email, и сразу сможешь искать сотрудников.`,
		};
	}
	return {
		greetings: `Привет, ${userName}! Мы получили запрос на активацию твоего аккаунта. Это последний шаг — подтверди email, и сразу сможешь искать работу.`,
	};
}
