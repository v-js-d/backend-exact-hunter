import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { SmokeValidateRequestDto } from '../dto/smoke-validate-request.dto';
import { SmokeErrorQueryDto } from '../dto/smoke-error-query.dto';
import { SmokeHealthResponseDto } from '../dto/smoke-health-response.dto';
import { SmokeValidateResponseDto } from '../dto/smoke-validate-response.dto';
import { SmokeHealthStatusEnum } from '../enums/smoke-health-status.enum';
import { SmokeErrorTypeEnum } from '../enums/smoke-error-type.enum';

@Injectable()
export class SmokeService {
	health(): SmokeHealthResponseDto {
		return { status: SmokeHealthStatusEnum.OK };
	}
	validate(body: SmokeValidateRequestDto): SmokeValidateResponseDto {
		return body;
	}
	getError(query: SmokeErrorQueryDto): void {
		const errorText = `Smoke: ${query.type}`;
		switch (query.type) {
			case SmokeErrorTypeEnum.BAD_REQUEST:
				throw new BadRequestException(errorText);
			case SmokeErrorTypeEnum.UNAUTHORIZED:
				throw new UnauthorizedException(errorText);
			case SmokeErrorTypeEnum.FORBIDDEN:
				throw new ForbiddenException(errorText);
			case SmokeErrorTypeEnum.NOT_FOUND:
				throw new NotFoundException(errorText);
			case SmokeErrorTypeEnum.CONFLICT:
				throw new ConflictException(errorText);
			case SmokeErrorTypeEnum.INTERNAL:
				throw new InternalServerErrorException(errorText);
			default:
				throw new InternalServerErrorException(errorText);
		}
	}
}
