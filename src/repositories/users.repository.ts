// Packages
import { inject, injectable } from 'inversify';
// Database
import { ApplicationDbContext } from '../database/application-db.context';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '.prisma/client';
// Constants
import { TYPES } from '../constants/types';
import { MODELS } from '../constants/models';
// Types
import { IUserRepository } from './abstractions/users.repository.interface';
import { IStorageManager } from '../database/abstractions/storage-manager.interface';

/**
 * A user repository that interacts with the user model using the database or the memory storage.
 */
@injectable()
export class UserRepository implements IUserRepository {
	private readonly dbContext: ApplicationDbContext<UserModel>;

	constructor(@inject(TYPES.IStorageManager) private readonly storageManager: IStorageManager) {
		this.dbContext = this.storageManager.getApplicationDbContext<UserModel>(MODELS.User);
	}

	/**
	 * Method is used to get the list of users from the database or the memory storage
	 * @returns A list of users
	 */
	public async getAll(): Promise<UserModel[]> {
		return this.dbContext.getAll();
	}

	/**
	 * Method is used to get a user from the database or the memory storage by their id
	 * @param userId - A user id
	 * @returns A user or null if the user doesn't exist
	 */
	public async getById(userId: number): Promise<UserModel | null> {
		return this.dbContext.getById(userId);
	}

	/**
	 * Method is used to create a new user in the database or the memory storage
	 * @param user - A user entity
	 * @returns Created user
	 */
	public async create(user: User): Promise<UserModel> {
		const { email, username } = user;

		return this.dbContext.create({ email, username });
	}

	/**
	 * Method is used to delete a user from the database or the memory storage by their id
	 * @param userId - A user id
	 * @returns If the user has been deleted, true is returned, otherwise false
	 */
	public async delete(userId: number): Promise<boolean> {
		const result = await this.dbContext.delete(userId);

		return !!result;
	}
}
