import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { resolveDeviceIdFromHeaders } from '@/common/auth';
import { IRequestMeta } from '@/modules/token';

@Injectable()
export class AuthIRequestMetaService {
	fromRequest(request: Request): IRequestMeta {
		const deviceId = resolveDeviceIdFromHeaders(request.headers);
		return {
			deviceId,
			deviceName: typeof request.headers['x-device-name'] === 'string' ? request.headers['x-device-name'] : undefined,
			userAgent: request.headers['user-agent'],
			ipAddress: request.ip,
		};
	}
}
