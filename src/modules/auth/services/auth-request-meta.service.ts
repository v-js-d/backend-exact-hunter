import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { resolveDeviceIdFromHeaders } from '@/common/auth';
import { RequestMeta } from '@/modules/token';

@Injectable()
export class AuthRequestMetaService {
	fromRequest(request: Request): RequestMeta {
		const deviceId = resolveDeviceIdFromHeaders(request.headers);
		return {
			deviceId,
			deviceName: typeof request.headers['x-device-name'] === 'string' ? request.headers['x-device-name'] : undefined,
			userAgent: request.headers['user-agent'],
			ipAddress: request.ip,
		};
	}
}
