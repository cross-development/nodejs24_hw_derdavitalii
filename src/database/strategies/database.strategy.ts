// Packages
import { PrismaClient } from '@prisma/client';
// Database
import { IBaseModel } from '../abstractions/base-model.interface';
import { IStorageStrategy } from '../abstractions/storage-strategy.interface';
// Constants
import { MODELS } from '../../constants/models';

/**
 * Database strategy is used to store data in the database
 */
export class DatabaseStrategy<T extends IBaseModel> implements IStorageStrategy<T> {
	private readonly prisma: PrismaClient;

	private modelName: MODELS;

	constructor() {
		this.prisma = new PrismaClient();
	}

	/**
	 * Method is used to connect to the prisma client.
	 */
	public async connect(): Promise<void> {
		await this.prisma.$connect();
	}

	/**
	 * Method is used to disconnect from the prisma client.
	 */
	public async disconnect(): Promise<void> {
		await this.prisma.$disconnect();
	}

	/**
	 * Method is used to register a model name in the database
	 * @param modelName - A model in the database
	 */
	public registerModel(modelName: MODELS): void {
		this.modelName = modelName;
	}

	/**
	 * Method is used to get all the database using a model name
	 * @returns The data from the database
	 */
	public async getAll(): Promise<T[]> {
		return this.prisma[this.modelName].findMany() as any;
	}

	/**
	 * Method is used to get a unique entity from the database.
	 * @param id - An entity id
	 * @returns An entity or null if it doesn't exists
	 */
	public async getById(id: number): Promise<T | null> {
		return this.prisma[this.modelName].findUnique({ where: { id } }) as any;
	}

	/**
	 * Method is used to create a new entity in the database
	 * @param entity - An entity from which the data will be obtained
	 * @returns Created model
	 */
	public async create(data: Omit<T, 'id'>): Promise<T> {
		return this.prisma[this.modelName].create({ data: data as any }) as any;
	}

	/**
	 * Method is used to delete an entity by its id
	 * @param id - An entity id
	 * @returns If the entity was deleted, true is returned, otherwise false
	 */
	public async delete(id: number): Promise<boolean> {
		const result = await this.prisma[this.modelName].delete({ where: { id } });

		return !!result;
	}
}
