import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common';

export class ValidationException extends BadRequestException {
	constructor(errors: ValidationError[]) {
		super({
			message: 'Validation failed',
			statusCode: HttpStatus.BAD_REQUEST,
			errors: errors.map((error) => ({
				property: error.property,
				constraints: error.constraints,
			})),
		});
	}
}
