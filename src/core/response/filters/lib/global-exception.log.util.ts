import * as path from 'path';
import { Logger } from '@nestjs/common';
import { Request } from 'express';

export class GlobalExceptionFilterLogger {
	private readonly logger = new Logger(GlobalExceptionFilterLogger.name);
	private getValidationErrorLogMessage(request: Request, message: string[] | string) {
		const validationMessages = Array.isArray(message) ? message.join('\n- ') : String(message);

		const fullMessage = `❌ Validation error:\n- ${validationMessages}\n\n📍 URL: ${request.method} ${request.url} `;
		return fullMessage;
	}

	private getErrorLogMessage(error: Error, request: Request): string {
		// Разбор stack trace
		let file = '';
		let line = '';
		let func = '';
		let code = '';
		try {
			const stackLines = error.stack?.split('\n') || [];
			const target = stackLines.find((l) => l.includes('/src/') || l.includes('src\\'));
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
	public logError(request: Request, error: Error) {
		const logMessage = this.getErrorLogMessage(error, request);
		this.logger.error(logMessage);
	}
	public logValidationError(
		request: Request,

		message: string[] | string,
	) {
		const logMessage = this.getValidationErrorLogMessage(request, message);
		this.logger.warn(logMessage);
	}
}
