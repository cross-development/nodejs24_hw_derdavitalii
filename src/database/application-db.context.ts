// Packages
import { inject, injectable } from 'inversify';
// Database
import { DatabaseStrategy } from './strategies/database.strategy';
import { InMemoryStrategy } from './strategies/in-memory.strategy';
// Constants
import { TYPES } from '../constants/types';
import { MODELS } from '../constants/models';
// Types
import { TStorageConfig } from '../types/app.config.interface';
import { IBaseModel } from './abstractions/base-model.interface';
import { IStorageStrategy } from './abstractions/storage-strategy.interface';
import { IConfigService } from '../services/abstractions/config.service.interface';
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * The application database context is used to define a storage strategy and interact with a database (memory storage)
 */
@injectable()
export class ApplicationDbContext<T extends IBaseModel = any> {
	private storageStrategy: IStorageStrategy<T>;

	constructor(
		@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
	) {
		if (this.configService.get<TStorageConfig>('storage').source === 'db') {
			this.loggerService.info('[ApplicationDbContext]', 'The DatabaseStrategy is being used');

			this.storageStrategy = new DatabaseStrategy<T>();
		} else {
			this.loggerService.info('[ApplicationDbContext]', 'The InMemoryStrategy is being used');

			this.storageStrategy = new InMemoryStrategy<T>();
		}
	}

	/**
	 * Method is used to connect to the storage defined by a particular strategy
	 */
	public async connect(): Promise<void> {
		await this.storageStrategy.connect();
	}

	/**
	 * Method is used to disconnect from the storage defined by a particular strategy
	 */
	public async disconnect(): Promise<void> {
		await this.storageStrategy.disconnect();
	}

	/**
	 * Method is used to get the application database context
	 * @param modelName - A model name
	 * @returns The instance of the ApplicationDbContext
	 */
	public getContext(modelName: MODELS): ApplicationDbContext<T> {
		this.storageStrategy.registerModel(modelName);

		this.loggerService.info('[ApplicationDbContext]', `The ${modelName} context has been registered`);

		return this;
	}

	/**
	 * Method is used to get all the data from the particular storage
	 * @returns The data from memory by model name
	 */
	public async getAll(): Promise<T[]> {
		return this.storageStrategy.getAll();
	}

	/**
	 * Method is used to get a unique entity from the particular storage
	 * @param id - An entity id
	 * @returns An entity or null if it doesn't exists
	 */
	public async getById(id: number): Promise<T | null> {
		return this.storageStrategy.getById(id);
	}

	/**
	 * Method is used to create a new entity in the particular storage
	 * @param entity - An entity from which the data will be obtained
	 * @returns Created model
	 */
	public async create(data: Omit<T, 'id'>): Promise<T> {
		return await this.storageStrategy.create(data);
	}

	/**
	 * Method is used to delete an entity by its id
	 * @param id - An entity id
	 * @returns If the entity was deleted, true is returned, otherwise false
	 */
	public async delete(id: number): Promise<boolean> {
		return await this.storageStrategy.delete(id);
	}
}
