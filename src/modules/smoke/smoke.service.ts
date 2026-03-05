import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
	SmokeErrorQueryDto,
	SmokeErrorType,
	SmokeHealthResponseDto,
	SmokeHealthStatus,
	SmokeValidateRequestDto,
	SmokeValidateResponseDto,
} from './smoke.dto';

@Injectable()
export class SmokeService {
	health(): SmokeHealthResponseDto {
		return { status: SmokeHealthStatus.OK };
	}
	validate(body: SmokeValidateRequestDto): SmokeValidateResponseDto {
		return body;
	}
	getError(query: SmokeErrorQueryDto): void {
		const errorText = `Smoke: ${query.type}`;
		switch (query.type) {
			case SmokeErrorType.BAD_REQUEST:
				throw new BadRequestException(errorText);
			case SmokeErrorType.UNAUTHORIZED:
				throw new UnauthorizedException(errorText);
			case SmokeErrorType.FORBIDDEN:
				throw new ForbiddenException(errorText);
			case SmokeErrorType.NOT_FOUND:
				throw new NotFoundException(errorText);
			case SmokeErrorType.CONFLICT:
				throw new ConflictException(errorText);
			case SmokeErrorType.INTERNAL:
				throw new InternalServerErrorException(errorText);
			default:
				throw new InternalServerErrorException(errorText);
		}
	}
}
