import React from 'react';
import { Button as ReactEmailButton } from 'react-email';

interface ButtonProps {
	href: string;
	children: React.ReactNode;
}

export function Button({ href, children }: ButtonProps) {
	return (
		<ReactEmailButton
			href={href}
			className="inline-block rounded-full bg-email-primary px-10 py-4 text-[15px] font-semibold leading-none tracking-wide text-email-primary-fg no-underline"
		>
			{children}
		</ReactEmailButton>
	);
}
