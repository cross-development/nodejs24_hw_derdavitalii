// Packages
import { injectable } from 'inversify';
import { Response, Router } from 'express';
// Constants
import { StatusCode } from '../../constants/statusCode.enum';
// Types
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILoggerService } from '../../services/abstractions/logger.service.interface';

/**
 * A base controller for all other controllers (parent class)
 */
@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private readonly logger: ILoggerService) {
		this._router = Router();
	}

	/**
	 * Getter for the router
	 */
	get router(): Router {
		return this._router;
	}

	/**
	 * Method used to send data to the client
	 * @param res - The express response
	 * @param code - A status code, see the StatusCode enum
	 * @param message - A message to send to a client
	 * @returns A result of execution of status and json methods
	 */
	private send<T>(res: Response, code: StatusCode, message: T): ExpressReturnType {
		res.type('application/json');

		return res.status(code).json(message);
	}

	/**
	 * Method used handle responses with an ok status
	 * @param res - The express response
	 * @param message - A message to send to a client
	 * @returns A result of execution of send method with 200 status
	 */
	protected ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, StatusCode.OK, message);
	}

	/**
	 * Method used to handle responses with a created status
	 * @param res - The express response
	 * @returns A result of execution of sendStatus method with 201 status
	 */
	protected created(res: Response): ExpressReturnType {
		return res.sendStatus(StatusCode.Created);
	}

	/**
	 * Method used to handle responses with a no content status
	 * @param res - The express response
	 * @returns A result of execution of sendStatus method with 204 status
	 */
	protected noContent(res: Response): ExpressReturnType {
		return res.sendStatus(StatusCode.NoContent);
	}

	/**
	 * Method used to bind all the routes provided
	 * @param routes - A list of routes to bind to the router
	 */
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
