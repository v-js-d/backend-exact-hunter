import { applyDecorators } from '@nestjs/common';
import { Validate } from 'class-validator';
import { IdentifierValidator } from '@/common/validators/identifier.validator';

export function IsIdentifier() {
	return applyDecorators(Validate(IdentifierValidator));
}
