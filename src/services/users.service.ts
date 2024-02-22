// Packages
import { inject, injectable } from 'inversify';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '../entities/models/user.model';
// Dto
import { CreateUserRequestDto } from '../entities/dto/create-user-request.dto';
// Constants
import { TYPES } from '../constants/types';
// Types
import { IUserService } from './abstractions/users.service.interface';
import { IUserRepository } from '../repositories/abstractions/users.repository.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository) {}

	public async getAllUsers(): Promise<UserModel[]> {
		return this.userRepository.findAll();
	}

	public async getUserById(userId: number): Promise<UserModel | null> {
		return this.userRepository.findOne(userId);
	}

	public async createUser(dto: CreateUserRequestDto): Promise<UserModel> {
		const { email, username } = dto;

		const newUser = new User(email, username);

		return this.userRepository.create(newUser);
	}

	public async deleteUser(userId: number): Promise<boolean> {
		const existedUser = await this.userRepository.findOne(userId);

		if (!existedUser) {
			return false;
		}

		return this.userRepository.delete(userId);
	}
}
