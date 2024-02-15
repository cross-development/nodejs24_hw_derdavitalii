// Core
import { Server, createServer } from 'http';
// Controllers
import { ErrorController } from './controllers/error.controller';
import { HealthCheckController } from './controllers/health-check.controller';
// Types
import { ILogger } from './types/logger.interface';
import { IAppConfig } from './types/app-config.interface';
import { IConfigService } from './types/config.service.interface';

/**
 * Application class, the main class for the server
 */
export class App {
	private readonly server: Server;
	private readonly port: number;

	private readonly errorController: ErrorController;
	private readonly healthCheckController: HealthCheckController;

	constructor(
		private readonly logger: ILogger,
		private readonly configService: IConfigService,
	) {
		this.server = createServer();
		this.port = this.configService.get<IAppConfig>('application').port;

		// Looking forward to the DI and IoC :)
		this.errorController = new ErrorController(logger);
		this.healthCheckController = new HealthCheckController(logger);
	}

	/**
	 * Method used to initialize the server
	 */
	public init(): void {
		this.useRoutes();
		this.listen();
	}

	/**
	 * Method used to use server routes
	 */
	private useRoutes(): void {
		this.server.on('request', (req, res) => {
			if (req.url === '/healthcheck' && req.method === 'GET') {
				return this.healthCheckController.handleHealthCheck(req, res);
			}

			this.errorController.handleError(req, res);
		});
	}

	/**
	 * Method used to listen to the server connection
	 */
	private listen(): void {
		this.server.listen(this.port, () => {
			this.logger.info(`Server started listening on port ${this.port}`);
		});
	}
}
