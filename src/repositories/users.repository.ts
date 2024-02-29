// Packages
import { inject, injectable } from 'inversify';
// Database
import { PrismaService } from '../database/prisma.service';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '.prisma/client';
// Constants
import { TYPES } from '../constants/types';
// Types
import { IUserRepository } from './abstractions/users.repository.interface';

/**
 * A user repository that interacts with the user model using the database or the memory storage.
 */
@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}

	/**
	 * Method is used to get the list of users from the database or the memory storage
	 * @returns A list of users
	 */
	public async findAll(): Promise<UserModel[]> {
		return this.prismaService.client.userModel.findMany();
	}

	/**
	 * Method is used to get a user from the database or the memory storage by their id
	 * @param userId - A user id
	 * @returns A user or null if the user doesn't exist
	 */
	public async findOne(userId: number): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({ where: { id: userId } });
	}

	/**
	 * Method is used to create a new user in the database or the memory storage
	 * @param user - A user entity
	 * @returns Created user
	 */
	public async create(user: User): Promise<UserModel> {
		const { email, username } = user;

		return this.prismaService.client.userModel.create({ data: { email, username } });
	}

	/**
	 * Method is used to delete a user from the database or the memory storage by their id
	 * @param userId - A user id
	 * @returns If the user has been deleted, true is returned, otherwise false
	 */
	public async delete(userId: number): Promise<boolean> {
		const result = await this.prismaService.client.userModel.delete({ where: { id: userId } });

		return !!result;
	}
}
