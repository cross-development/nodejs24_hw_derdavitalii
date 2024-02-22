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

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService) {}

	public catch(error: Error | BusinessException, req: Request, res: Response, next: NextFunction): void {
		if (error instanceof BusinessException) {
			this.loggerService.error(error.context, `Error ${error.statusCode}: ${error.message}`);

			res.status(error.statusCode).send({ error: error.message });
		} else {
			this.loggerService.error('exceptionFilter', `${error.message}`);

			res.status(StatusCode.InternalServerError).send({ error: error.message });
		}
	}
}
