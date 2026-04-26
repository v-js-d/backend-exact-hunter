import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((field: string | undefined, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest<{ user?: Record<string, unknown> }>();
	const user = request.user;

	if (!user) {
		return undefined;
	}

	if (!field) {
		return user;
	}

	return user[field];
});
