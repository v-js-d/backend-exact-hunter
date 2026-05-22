import * as path from 'path';
import { HttpException, Logger } from '@nestjs/common';
import { Request } from 'express';

type ValidationFieldError = {
	property?: unknown;
	constraints?: unknown;
};

export class AllExceptionsFilterLogger {
	private readonly logger = new Logger(AllExceptionsFilterLogger.name);

	private getValidationErrorLogMessage(request: Request, errors: unknown) {
		const validationMessages = Array.isArray(errors)
			? errors
					.map((error, index) => {
						if (!error || typeof error !== 'object') {
							return `${index + 1}. ${String(error)}`;
						}

						const validationError = error as ValidationFieldError;
						const property =
							typeof validationError.property === 'string' ? validationError.property : `field_${index + 1}`;
						const constraints =
							validationError.constraints && typeof validationError.constraints === 'object'
								? Object.entries(validationError.constraints as Record<string, unknown>)
								: [];

						if (constraints.length === 0) {
							return `${index + 1}. ${property}\n   - No constraints`;
						}

						const constraintMessages = constraints
							.map(([rule, message]) => `   - ${rule}: ${String(message)}`)
							.join('\n');

						return `${index + 1}. ${property}\n${constraintMessages}`;
					})
					.join('\n\n')
			: String(errors);

		return `Validation error\n\nURL: ${request.method} ${request.url}\n\nFields:\n${validationMessages}`;
	}

	private getErrorLogMessage(error: Error, request: Request): string {
		let file = '';
		let line = '';
		let func = '';
		let code = '';

		try {
			const stackLines = error.stack?.split('\n') || [];
			const target = stackLines.find((stackLine) => stackLine.includes('/src/') || stackLine.includes('src\\'));

			if (target) {
				const match = target.match(/\((.*):(\d+):(\d+)\)/);
				if (match) {
					const [, filepath, lineno] = match;
					file = path.relative(process.cwd(), filepath);
					line = lineno;
				}
			}

			func = stackLines[1]?.trim().split(' ')[1] || 'unknown';
			code = stackLines[1] || '';
		} catch (e) {
			this.logger.warn('Stack trace parse failed', e);
		}

		const ip = (request.headers['x-forwarded-for'] as string | undefined) || request.socket.remoteAddress || 'unknown';
		const userAgent = request.headers['user-agent'] || 'unknown';
		const referer = request.headers['referer'] || 'n/a';

		const message = `⚠️ Ошибка: ${error.name}\n\n📄 Файл: ${file}\n🔢 Строка: ${String(line)}\n🔧 Функция: ${func}\n\n💥 Код: ${code}\n\n📬 Сообщение: ${error.message}\n\n📍 URL: ${request.method} ${request.url}\n🧭 User-Agent: ${userAgent}\n🌍 IP: ${String(ip)}\n🔗 Referer: ${referer}`;
		return message;
	}

	public logError(request: Request, error: HttpException) {
		const logMessage = this.getErrorLogMessage(error, request);
		this.logger.error(logMessage);
	}

	public logValidationError(request: Request, message: unknown) {
		const logMessage = this.getValidationErrorLogMessage(request, message);
		this.logger.warn(logMessage);
	}
}
