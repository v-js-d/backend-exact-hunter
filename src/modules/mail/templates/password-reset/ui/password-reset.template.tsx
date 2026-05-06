import { Section, Text } from 'react-email';

import { Button, EmailLayout } from '../../shared';
import { getPasswordResetText } from '../utils/password-reset-text.util';

interface PasswordResetTemplateProps {
	name: string;
	logoUrl: string;
	brandName: string;
	resetLink: string;
	/** Пока не используется визуально — оставлено для будущей локализации доменов. */
	clientUrl: string;
	expiresInMinutes: number;
}

export function PasswordResetTemplate({
	name,
	brandName,
	logoUrl,
	resetLink,
	expiresInMinutes,
}: PasswordResetTemplateProps) {
	const text = getPasswordResetText(expiresInMinutes, brandName, name);
	const { preview, heroTitle, heroSubtitle, greetings, button, buttonLink, buttonText } = text;
	return (
		<EmailLayout
			preview={preview}
			heroTitle={heroTitle}
			heroSubtitle={heroSubtitle}
			brandName={brandName}
			logoUrl={logoUrl}
		>
			<Text className="mx-0 mt-0 mb-5 text-center text-[15px] leading-relaxed text-email-fg">{greetings}</Text>

			<Section className="px-0 py-2 pt-2 pb-1 text-center">
				<Button href={resetLink}>{button}</Button>
			</Section>

			<Text className="mx-0 mt-6 mb-1 text-center text-xs leading-normal text-email-muted">{buttonLink}</Text>
			<Text className="m-0 break-all text-center text-[11px] leading-normal text-email-primary">{resetLink}</Text>

			<Text className="mx-0 mt-7 mb-0 text-center text-xs leading-normal text-email-muted">
				{buttonText}
				будут разлогинены.
			</Text>
		</EmailLayout>
	);
}
