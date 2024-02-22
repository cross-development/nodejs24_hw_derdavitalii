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

@injectable()
export class PersistenceService {
	private readonly pathToDatabase: string;

	private data: UserModel[] = [];

	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService) {
		this.pathToDatabase = path.join(__dirname, 'db.json');
	}

	public async connect(): Promise<void> {
		try {
			const loadedData = await fsAsync.readFile(this.pathToDatabase, { encoding: 'utf-8', flag: 'a+' });

			this.data = JSON.parse(loadedData || '[]');

			this.loggerService.info('database', 'Connection to the database has been established');
		} catch (error) {
			this.loggerService.error('database', 'The error has been occurred while connecting to the database');
		}
	}

	public async disconnect(): Promise<void> {
		try {
			const stringifiedData = JSON.stringify(this.data, null, 2);

			await fsAsync.writeFile(this.pathToDatabase, stringifiedData);

			this.loggerService.info('database', 'The database has been disconnected');
		} catch (error) {
			this.loggerService.error('database', 'The error has been occurred while disconnecting from the database');
		}
	}

	public async findMany<T>(): Promise<T[]> {
		return this.data as T[];
	}

	public async findUnique<T>(id: number): Promise<T | null> {
		const item = this.data.find((item) => item.id === id) as T;

		return item || null;
	}

	public async create<T>(entity: User): Promise<T> {
		const user = new UserModel();

		user.id = this.data.length;
		user.email = entity.email;
		user.username = entity.username;

		this.data.push(user);

		return user as T;
	}

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
