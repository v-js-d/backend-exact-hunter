import { Section, Text } from 'react-email';

import { EmailLayout, Button } from '../../shared';
import { EnumEmailTextByRoleType } from '../../type/text.type';
import { getEmailVerificationText } from '../utils/email-verification-text.util';

interface EmailVerificationTemplateProps {
	name: string;
	logoUrl: string;
	brandName: string;
	role: EnumEmailTextByRoleType;
	activationLink: string;
}

export function EmailVerificationTemplate({
	name,
	brandName,
	logoUrl,
	activationLink,
	role,
}: EmailVerificationTemplateProps) {
	const text = getEmailVerificationText(role, brandName, name);
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
				<Button href={activationLink}>{button}</Button>
			</Section>

			<Text className="mx-0 mt-6 mb-1 text-center text-xs leading-normal text-email-muted">{buttonLink}</Text>
			<Text className="m-0 break-all text-center text-[11px] leading-normal text-email-primary">{activationLink}</Text>

			<Text className="mx-0 mt-7 mb-0 text-center text-xs leading-normal text-email-muted">{buttonText}</Text>
		</EmailLayout>
	);
}
