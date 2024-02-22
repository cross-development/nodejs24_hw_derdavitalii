// Packages
import { injectable } from 'inversify';
import { Response, Router } from 'express';
// Constants
import { StatusCode } from '../../constants/statusCode.enum';
// Types
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILoggerService } from '../../services/abstractions/logger.service.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private readonly logger: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	private send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');

		return res.status(code).json(message);
	}

	protected ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, StatusCode.OK, message);
	}

	protected created(res: Response): ExpressReturnType {
		return res.sendStatus(StatusCode.Created);
	}

	protected noContent(res: Response): ExpressReturnType {
		return res.sendStatus(StatusCode.NoContent);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.info('bindRoutes', `[${route.method}] ${route.path}`);

			const handler = route.handler.bind(this);

			const middleware = route.middleware?.map((m) => m.execute.bind(m));
			const pipeline = middleware ? [...middleware, handler] : handler;

			this.router[route.method](route.path, pipeline);
		}
	}
}
