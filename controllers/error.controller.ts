// Core
import { IncomingMessage, ServerResponse } from 'http';
// Constants
import { StatusCode } from '../constants/statusCode.enum';
// Types
import { ILogger } from '../types/logger.interface';

/**
 * Error controller. Used to handle requests for any unhandled urls
 */
export class ErrorController {
	constructor(private readonly logger: ILogger) {}

	/**
	 * Method used to handle the request for any unhandled urls
	 * @param req - The server request
	 * @param res - The server response
	 */
	public handleError(req: IncomingMessage, res: ServerResponse): void {
		res.writeHead(StatusCode.NotFound);

		this.logger.warn(`${req.method} ${req.url} ${res.statusCode}`);

		res.end('404 Not Found');
	}
}
