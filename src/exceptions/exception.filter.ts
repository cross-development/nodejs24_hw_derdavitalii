// Packages
import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
// Errors
import { BusinessException } from './business-exception';
// Constants
import { TYPES } from '../constants/types';
import { StatusCode } from '../constants/statusCode.enum';
// Types
import { IExceptionFilter } from './abstractions/exception.filter.interface';
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * An exception filter is used to catch all errors globally
 */
@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService) {}

	/**
	 * Method is used to catch all errors occurring in the app
	 * @param error - An instance of the Error or custom Business exception
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 */
	public catch(error: Error | BusinessException, req: Request, res: Response, next: NextFunction): void {
		if (error instanceof BusinessException) {
			this.loggerService.error(error.context, `${error.statusCode}: ${error.message}`);

			res.status(error.statusCode).send({ error: error.message });
		} else {
			this.loggerService.error('[ExceptionFilter]', `${error.message}`);

			res.status(StatusCode.InternalServerError).send({ error: error.message });
		}
	}
}
