// Core
import path from 'path';
import fsAsync from 'fs/promises';
// Packages
import { inject, injectable } from 'inversify';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '../entities/models/user.model';
// Constants
import { TYPES } from '../constants/types';
// Types
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * Memory storage used to simulate a database behavior.
 * At first I made this storage to be generic, but we need to create a new user somewhere.
 * That's why it is only adjusted to work with the UserModel
 */
@injectable()
export class MemoryStorage {
	private readonly pathToDatabase: string;

	private data: UserModel[] = [];

	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService) {
		this.pathToDatabase = path.join(__dirname, 'db.json');
	}

	/**
	 * Method used to load data from a database file and store received data in memory.
	 */
	public async connect(): Promise<void> {
		try {
			const loadedData = await fsAsync.readFile(this.pathToDatabase, { encoding: 'utf-8', flag: 'a+' });

			this.data = JSON.parse(loadedData || '[]');

			this.loggerService.info('database', 'Connection to the database has been established');
		} catch (error) {
			this.loggerService.error('database', 'The error has been occurred while connecting to the database');
		}
	}

	/**
	 * Method used to save data from memory to the database file after the server stops
	 */
	public async disconnect(): Promise<void> {
		try {
			const stringifiedData = JSON.stringify(this.data, null, 2);

			await fsAsync.writeFile(this.pathToDatabase, stringifiedData);

			this.loggerService.info('database', 'The database has been disconnected');
		} catch (error) {
			this.loggerService.error('database', 'The error has been occurred while disconnecting from the database');
		}
	}

	/**
	 * Method used to get the data from memory (a list of users)
	 * @returns The data from memory. In fact, it is a list of users
	 */
	public async findMany(): Promise<UserModel[]> {
		return this.data;
	}

	/**
	 * Method used to get a unique entity from memory.
	 * @param id - An entity (user) id to get the data from memory (specific user by id)
	 * @returns An entity or null if it doesn't exists
	 */
	public async findUnique(id: number): Promise<UserModel | null> {
		const item = this.data.find((item) => item.id === id);

		return item || null;
	}

	/**
	 * Method used to create a new entity in memory (a new user)
	 * @param entity - An entity from which the data will be obtained
	 * @returns Created model (user)
	 */
	public async create(entity: User): Promise<UserModel> {
		const user = new UserModel();

		user.id = this.data.length;
		user.email = entity.email;
		user.username = entity.username;

		this.data.push(user);

		return user;
	}

	/**
	 * Method used to delete an entity by its id (user id)
	 * @param id - An entity id (user id)
	 * @returns If the entity was deleted, true is returned, otherwise false
	 */
	public async delete(id: number): Promise<boolean> {
		const indexToDelete = this.data.findIndex((item) => item.id === id);

		// Invalid id checking
		if (indexToDelete === -1) {
			return false;
		}

		this.data.splice(indexToDelete, 1);

		return true;
	}
}
