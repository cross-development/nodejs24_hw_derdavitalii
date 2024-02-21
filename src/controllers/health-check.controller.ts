// Core
import { IncomingMessage, ServerResponse } from 'http';
// Constants
import { StatusCode } from '../constants/statusCode.enum';
// Types
import { ILogger } from '../types/logger.interface';

/**
 * HealthCheck controller. Used to handle requests for the healthcheck url.
 */
export class HealthCheckController {
	constructor(private readonly logger: ILogger) {}

	/**
	 * Method used to handle the request for the GET /healthcheck url
	 * @param req - The server request
	 * @param res - The server response
	 */
	public handleHealthCheck(req: IncomingMessage, res: ServerResponse): void {
		res.writeHead(StatusCode.OK);

		this.logger.info(`${req.method} ${req.url} ${res.statusCode}`);

		res.end('healthcheck passed');
	}
}
