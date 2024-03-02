// Packages
import express, { Express } from 'express';
import { injectable, inject } from 'inversify';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
// Controllers
import { UserController } from './controllers/users.controller';
// Constants
import { TYPES } from './constants/types';
// Types
import { TServerConfig } from './types/app.config.interface';
import { ILoggerService } from './services/abstractions/logger.service.interface';
import { IConfigService } from './services/abstractions/config.service.interface';
import { IStorageManager } from './database/abstractions/storage-manager.interface';
import { IExceptionFilter } from './exceptions/abstractions/exception.filter.interface';

/**
 * Application class, the main class for the server
 */
@injectable()
export class App {
	private readonly app: Express;
	private readonly port: number;

	constructor(
		@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
		@inject(TYPES.IUserController) private readonly userController: UserController,
		@inject(TYPES.IExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.IStorageManager) private readonly storageManager: IStorageManager,
	) {
		this.app = express();
		this.port = this.configService.get<TServerConfig>('server').port;
	}

	/**
	 * Method is used to initialize the server
	 */
	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.useDatabase();

		this.listen();
	}

	/**
	 * Method is used to register middleware
	 */
	private useMiddleware(): void {
		this.app.use(helmet());
		this.app.use(cors({ origin: this.configService.get<TServerConfig>('server').allowedOrigin }));

		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		// https://www.npmjs.com/package/morgan#using-format-string-of-predefined-tokens
		this.app.use(morgan(':method :url :status'));
	}

	/**
	 * Method is used to register server routes
	 */
	private useRoutes(): void {
		this.app.use('/api/users', this.userController.router);
	}

	/**
	 * Method is used to register exception filters
	 */
	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	/**
	 * Method is used to register the database (or a memory storage)
	 */
	private async useDatabase(): Promise<void> {
		await this.storageManager.initialize();

		// https://nodejs.org/api/process.html
		process.on('SIGINT', async () => {
			await this.storageManager.dispose();

			process.exit(0);
		});
	}

	/**
	 * Method is used to listen to the server connection
	 */
	private listen(): void {
		this.app.listen(this.port, () => {
			this.loggerService.info('app', `Server started listening on port ${this.port}`);
		});
	}
}
