/**
 * Цветовая палитра email-писем, синхронизирована с темой `sociopath-dark`
 * из `packages/ui/src/styles/themes/sociopath-dark.css`.
 *
 * Используем только plain hex, потому что почтовые клиенты (Gmail,
 * Outlook, Apple Mail) не поддерживают `oklch()` и CSS-переменные. Все
 * значения ниже — ручной перевод соответствующих `oklch(...)` в
 * ближайший sRGB hex.
 */
export const EMAIL_DARK_THEME = {
	/** `основной тёмный фон страницы */
	background: '#eef2f5', // '#212121',
	/** ` поверхность карточки */
	card: '#fafafa',
	/** `акцентный блок, слегка темнее карточки */
	accent: '#e5e5e5',
	/** `граница/муки/инпут */
	border: '#595959',
	/** `основной светлый текст */
	foreground: '#212121',
	/** ` приглушённый текст */
	mutedForeground: '#A8A8A8',
	/** `фирменный акцент */
	primary: '#35a8e1',
	primaryForeground: '#ffffff',
} as const;

/**
 * Базовые параметры типографики для fallback и <Font/>-тега в head.
 */
export const EMAIL_FONT_STACK = 'Geist, "Segoe UI", Arial, sans-serif';

/**
 * Конфиг для `<Tailwind>`-обёртки из `@react-email/components`.
 *
 */
export const EMAIL_TAILWIND_CONFIG = {
	theme: {
		extend: {
			colors: {
				'email-bg': EMAIL_DARK_THEME.background,
				'email-card': EMAIL_DARK_THEME.card,
				'email-accent': EMAIL_DARK_THEME.accent,
				'email-border': EMAIL_DARK_THEME.border,
				'email-fg': EMAIL_DARK_THEME.foreground,
				'email-muted': EMAIL_DARK_THEME.mutedForeground,
				'email-primary': EMAIL_DARK_THEME.primary,
				'email-primary-fg': EMAIL_DARK_THEME.primaryForeground,
			},
			fontFamily: {
				email: ['Geist', 'Segoe UI', 'Arial', 'sans-serif'],
			},
		},
	},
};
