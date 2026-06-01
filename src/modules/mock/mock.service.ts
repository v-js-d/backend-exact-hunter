import { Injectable, NotFoundException } from '@nestjs/common';

import { vacancies, Vacancy } from './vacancies';

@Injectable()
export class MockService {
	private readonly vacancies = vacancies;

	getVacancies(query: { page: string; limit: string }): {
		page: number;
		totalPages: number;
		totalItems: number;
		items: Vacancy[];
	} {
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 10;

		const start = (page - 1) * limit;
		const end = start + limit;

		const foundVacancies: Vacancy[] = this.vacancies.slice(start, end);

		return {
			page,
			totalPages: Math.ceil(this.vacancies.length / limit),
			totalItems: foundVacancies.length,
			items: foundVacancies,
		};
	}

	getVacancyById(id: string): Vacancy {
		const vacancy = this.vacancies.find((item) => item.id === id);

		if (!vacancy) {
			throw new NotFoundException(`Вакансия с id ${id} не найдена`);
		}

		return vacancy;
	}
}
