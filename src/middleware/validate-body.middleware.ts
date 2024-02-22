// Packages
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
// Middleware
import { BaseMiddleware } from './abstractions/base.middleware';
// Constants
import { StatusCode } from '../constants/statusCode.enum';
// Types
import { IMiddleware } from './abstractions/middleware.interface';

export class ValidateBodyMiddleware extends BaseMiddleware implements IMiddleware {
	constructor(private readonly classToValidate: ClassConstructor<object>) {
		super();
	}

	public execute(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, req.body);

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
