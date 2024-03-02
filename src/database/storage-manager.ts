// Packages
import { inject, injectable } from 'inversify';
// Constants
import { TYPES } from '../constants/types';
import { MODELS } from '../constants/models';
// Database
import { ApplicationDbContext } from './application-db.context';
// Types
import { IBaseModel } from './abstractions/base-model.interface';
import { IStorageManager } from './abstractions/storage-manager.interface';
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * The storage manager is used to initialize the storage where we can store the data.
 */
@injectable()
export class StorageManager implements IStorageManager {
	constructor(
		@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService,
		@inject(TYPES.ApplicationDbContext) private readonly applicationDbContext: ApplicationDbContext,
	) {}

	/**
	 * Method used to initialize the storage manager, open connection to the database (or memory storage)
	 */
	public async initialize(): Promise<void> {
		try {
			await this.applicationDbContext.connect();

			this.loggerService.info('[StorageManager]', `Initialized successfully`);
		} catch (error) {
			if (error instanceof Error) {
				this.loggerService.error('[StorageManager]', 'Failed to initialize: ' + error.message);
			}
		}
	}

	/**
	 * Method is used to dispose the storage manager after the application is terminated
	 */
	public async dispose(): Promise<void> {
		if (this.applicationDbContext) {
			try {
				await this.applicationDbContext.disconnect();

				this.loggerService.info('[StorageManager]', 'Disposed successfully');
			} catch (error) {
				if (error instanceof Error) {
					this.loggerService.error('[StorageManager]', 'Failed to dispose: ' + error.message);
				}
			}
		}
	}

	/**
	 * Method is used to get the application database context bound to the particular storage strategy
	 * @param modelName - A model name which will be used to interact with certain part in a storage
	 * @returns The application database context
	 */
	public getApplicationDbContext<T extends IBaseModel>(modelName: MODELS): ApplicationDbContext<T> {
		return this.applicationDbContext.getContext(modelName);
	}
}
