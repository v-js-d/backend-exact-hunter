export interface IResponseData<T> {
	result: T;
}

export interface IResponseError {
	message: string;
	errors?: string[];
}
