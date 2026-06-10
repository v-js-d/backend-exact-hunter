import { ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { EnumIdentifierType } from 'generated/prisma/enums';

import { IdentifyDto } from '@/modules/auth/dto/identify/identify.dto';

@ValidatorConstraint({ name: 'IdentifierValidator', async: false })
export class IdentifierValidator implements ValidatorConstraintInterface {
	public validate(value: string, args: ValidationArguments): boolean {
		const object = args.object as IdentifyDto;

		if (object.type === EnumIdentifierType.EMAIL) {
			return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
		} else if (object.type === EnumIdentifierType.PHONE) {
			return typeof value === 'string' && /^\+?\d{10,15}$/.test(value);
		}

		return false;
	}

	defaultMessage(args: ValidationArguments): string {
		const object = args.object as IdentifyDto;

		if (object.type === EnumIdentifierType.EMAIL) return 'identifier must be a valid email';
		if (object.type === EnumIdentifierType.PHONE) return 'identifier must be a valid phone number';

		return 'Invalid identifier';
	}
}
