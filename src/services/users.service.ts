// Packages
import { inject, injectable } from 'inversify';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '.prisma/client';
// Dto
import { CreateUserRequestDto } from '../entities/dto/create-user-request.dto';
// Constants
import { TYPES } from '../constants/types';
// Types
import { IUserService } from './abstractions/users.service.interface';
import { IUserRepository } from '../repositories/abstractions/users.repository.interface';

/**
 * A user service that encapsulates the business logic related to the CRUD operations with a user
 */
@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository) {}

	/**
	 * Method is used to get the list of users
	 * @returns A list of users
	 */
	public async getAllUsers(): Promise<UserModel[]> {
		return this.userRepository.findAll();
	}

	/**
	 * Method is used to get a user by their id
	 * @param userId - A user id
	 * @returns A user or null if the user doesn't exist
	 */
	public async getUserById(userId: number): Promise<UserModel | null> {
		return this.userRepository.findOne(userId);
	}

	/**
	 * Method is used to create a new user
	 * @param dto - A user dto to create a user
	 * @returns Created user
	 */
	public async createUser(dto: CreateUserRequestDto): Promise<UserModel> {
		const { email, username } = dto;

		const newUser = new User(email, username);

		return this.userRepository.create(newUser);
	}

	/**
	 * Method is used to delete a user by their id
	 * @param userId - A user id
	 * @returns If the user has been deleted, true is returned, otherwise false
	 */
	public async deleteUser(userId: number): Promise<boolean> {
		const existedUser = await this.userRepository.findOne(userId);

		if (!existedUser) {
			return false;
		}

		return this.userRepository.delete(userId);
	}
}
