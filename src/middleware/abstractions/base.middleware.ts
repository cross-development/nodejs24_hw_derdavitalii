// Packages
import { ValidationError } from 'class-validator';

export abstract class BaseMiddleware {
	protected formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
		const formattedErrors: Record<string, string[]> = {};

		errors.forEach((error) => {
			const property = error.property;

			Object.entries(error.constraints || {}).forEach(([constraintKey, constraintValue]) => {
				formattedErrors[property] = formattedErrors[property] || [];
				formattedErrors[property].push(constraintValue);
			});
		});

		return formattedErrors;
	}
}
