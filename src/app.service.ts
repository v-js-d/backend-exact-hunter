import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { configuration } from './config/configuration';

interface EnvironmentVariables {
	PORT: number;
	// TIMEOUT: {
	// 	TEST: number;
	// };
	TIMEOUT: string;
}

// enum ConfigEnum {
// 	PORT = 'PORT',
// 	TIMEOUT = 'TIMEOUT',
// }

// const TestObject = {
// 	PORT: 'PORT',
// 	TIMEOUT: 'TIMEOUT',
// } as const;

@Injectable()
export class AppService {
	// constructor(private configService: ConfigService<{ database: { host: string } }>) {}
	constructor(private configService: ConfigService<EnvironmentVariables>) {}

	getHello(): string {
		// const dbUser = this.configService.get<number>('PORT');
		// const test = process.env.PORT;
		// const test = this.configService.get<EnvironmentVariables['PORT']>(TestObject.PORT);
		// const test = this.configService.get(TestObject.TIMEOUT, { infer: true });
		// console.log(dbUser);
		// console.log(test);

		return 'Hello World!';
	}
}
