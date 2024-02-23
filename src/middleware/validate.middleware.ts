// Packages
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
// Constants
import { StatusCode } from '../constants/statusCode.enum';
// Types
import { IMiddleware } from './abstractions/middleware.interface';

/**
 * A middleware to validate different parts of the request (either body or params)
 */
export class ValidateMiddleware implements IMiddleware {
	constructor(
		private readonly classToValidate: ClassConstructor<object>,
		private readonly requestPart: 'body' | 'params' = 'body',
	) {}

	/**
	 * Method used to format all errors received during validation
	 * @param errors - All errors received during validation
	 * @returns Formatted errors using pattern "error_key": ['error_message_1', 'error_message_2']
	 */
	private formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
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

	/**
	 * Method used to execute a validation
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 */
	public execute(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, req[this.requestPart]);

		validate(instance).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				const formattedErrors = this.formatValidationErrors(errors);

				res.status(StatusCode.BadRequest).json({ errors: formattedErrors });
			} else {
				next();
			}
		});
	}
}
