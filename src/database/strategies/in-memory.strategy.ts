// Core
import path from 'path';
import fsAsync from 'fs/promises';
// Constants
import { MODELS } from '../../constants/models';
// Types
import { IBaseModel } from '../abstractions/base-model.interface';
import { IStorageStrategy } from '../abstractions/storage-strategy.interface';

/**
 * Memory strategy is used to store data in memory
 */
export class InMemoryStrategy<T extends IBaseModel> implements IStorageStrategy<T> {
	private readonly pathToDatabase: string;

	private modelName: MODELS;
	private data: Record<string, T[]> = {};

	constructor() {
		this.pathToDatabase = path.join(process.cwd(), 'in-memory-db', 'db.json');
	}

	/**
	 * Method is used to load data from a database file and store received data in memory.
	 */
	public async connect(): Promise<void> {
		const loadedData = await fsAsync.readFile(this.pathToDatabase, { encoding: 'utf-8', flag: 'a+' });

		this.data = JSON.parse(loadedData || '{}');
	}

	/**
	 * Method is used to save data from memory to the database file after the server stops
	 */
	public async disconnect(): Promise<void> {
		const stringifiedData = JSON.stringify(this.data, null, 2);

		await fsAsync.writeFile(this.pathToDatabase, stringifiedData);
	}

	/**
	 * Method is used to register a model name in the database (storage)
	 * @param modelName - A model in the database (storage)
	 */
	public registerModel(modelName: MODELS): void {
		this.modelName = modelName;
	}

	/**
	 * Method is used to get all the data from memory using a model name
	 * @returns The data from memory by model name
	 */
	public async getAll(): Promise<T[]> {
		return this.data[this.modelName] || [];
	}

	/**
	 * Method is used to get a unique entity from memory.
	 * @param id - An entity id
	 * @returns An entity or null if it doesn't exists
	 */
	public async getById(id: number): Promise<T | null> {
		const entityData = this.data[this.modelName] || [];

		return entityData.find((item: T) => item.id === id) || null;
	}

	/**
	 * Method is used to create a new entity in memory
	 * @param entity - An entity from which the data will be obtained
	 * @returns Created model
	 */
	public async create(data: Omit<T, 'id'>): Promise<T> {
		if (!this.data[this.modelName]) {
			this.data[this.modelName] = [];
		}

		const newData = { id: this.data[this.modelName].length, ...data } as T;

		this.data[this.modelName].push(newData);

		return newData;
	}

	/**
	 * Method is used to delete an entity by its id
	 * @param id - An entity id
	 * @returns If the entity was deleted, true is returned, otherwise false
	 */
	public async delete(id: number): Promise<boolean> {
		const entityData = this.data[this.modelName] || [];

		const indexToDelete = entityData.findIndex((item) => item.id === id);

		// Invalid id checking
		if (indexToDelete === -1) {
			return false;
		}

		this.data[this.modelName].splice(indexToDelete, 1);

		return true;
	}
}
