import React from 'react';
import { Body, Container, Font, Head, Html, Img, Preview, Section, Tailwind, Text } from 'react-email';
import { EMAIL_TAILWIND_CONFIG } from './theme';

interface EmailLayoutProps {
	/** Текст, показываемый в списке писем как preview */
	preview: string;
	/** Заголовок страницы письма — крупный hero */
	heroTitle: string;
	/** Подзаголовок под hero */
	heroSubtitle?: string;
	/** Название бренда */
	brandName: string;
	/** URL логотипа */
	logoUrl: string;
	children: React.ReactNode;
}

export function EmailLayout({ preview, heroTitle, heroSubtitle, brandName, logoUrl, children }: EmailLayoutProps) {
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Geist"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;500;700&display=swap',
						format: 'woff2',
					}}
				/>
			</Head>
			<Preview>{preview}</Preview>
			<Tailwind config={EMAIL_TAILWIND_CONFIG}>
				<Body className="m-0 w-full p-0 font-email text-email-bg ba-white">
					<Container className="mx-auto max-w-[560px] px-4 pt-8 pb-10">
						<Section className="px-0 py-2 pb-6 text-center">
							<table role="presentation" cellPadding={0} cellSpacing={0} border={0} align="center" className="mx-auto">
								<tbody>
									<tr>
										<td className="pr-3 align-middle">
											<Img src={logoUrl} width={55} height={55} alt="logo" className="block" />
										</td>
										<td className="align-middle">
											<Text className="m-0 text-[32px] font-bold leading-none tracking-tight text-email-primary">
												{brandName}
											</Text>
										</td>
									</tr>
								</tbody>
							</table>
						</Section>
						<Section className="rounded-2xl bg-email-card px-8 py-9">
							<Text className="mx-0 mt-0 mb-2 text-center text-[28px] font-bold leading-tight text-email-fg">
								{heroTitle}
							</Text>
							{heroSubtitle ? (
								<Text className="mx-0 mt-0 mb-6 text-center text-[15px] leading-normal text-email-muted">
									{heroSubtitle}
								</Text>
							) : null}
							{children}
						</Section>
						<Text className="mx-0 mt-6 mb-0 text-center text-xs text-email-muted">
							© {new Date().getFullYear()} {brandName}. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
