import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
	health() {
		return `The server is working`;
	}
}
