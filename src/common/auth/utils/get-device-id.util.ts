import type { IncomingHttpHeaders } from 'http';

/** Клиент (браузер / натив) передаёт стабильный id устройства; иначе сервер выдаёт новый и клиент должен сохранить. */
export const DEVICE_ID_HEADER = 'x-device-id';

const DEFAULT_DEVICE_ID = 'web';

export function resolveDeviceIdFromHeaders(headers: IncomingHttpHeaders): string {
	const raw = headers[DEVICE_ID_HEADER] ?? headers['X-Device-Id'];
	const v = Array.isArray(raw) ? raw[0] : raw;
	if (typeof v === 'string' && v.trim().length > 0) {
		return v.trim();
	}
	return DEFAULT_DEVICE_ID;
}
