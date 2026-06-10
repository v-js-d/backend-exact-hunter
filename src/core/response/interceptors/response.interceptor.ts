import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IResponseData } from '../interface/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponseData<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IResponseData<T>> {
		return next.handle().pipe(
			map((data) => ({
				result: data,
			})),
		);
	}
}
