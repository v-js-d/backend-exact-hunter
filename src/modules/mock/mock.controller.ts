import { Controller, Get, Param, Query } from '@nestjs/common';

import { MockService } from './mock.service';

@Controller('mock')
export class MockController {
	constructor(private readonly mockService: MockService) {}

	@Get('vacancies')
	getVacancies(@Query() query: { page: string; limit: string }) {
		return this.mockService.getVacancies(query);
	}

	@Get('vacancies/:id')
	getVacancyById(@Param('id') id: string) {
		return this.mockService.getVacancyById(id);
	}
}
