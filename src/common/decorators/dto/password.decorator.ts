import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isPassword',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					if (value === null || value === undefined) {
						return true;
					}

					return typeof value === 'string' && value.length >= 8 && value.length <= 32;
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be a string and have a length between 8 and 32`;
				},
			},
		});
	};
}
