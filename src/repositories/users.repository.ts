// Packages
import { inject, injectable } from 'inversify';
// Services
import { PersistenceService } from '../database/persistence.service';
// Entities
import { User } from '../entities/user.entity';
// Models
import { UserModel } from '../entities/models/user.model';
// Constants
import { TYPES } from '../constants/types';
// Types
import { IUserRepository } from './abstractions/users.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PersistenceService) private readonly persistanceService: PersistenceService) {}

	public async findAll(): Promise<UserModel[]> {
		return this.persistanceService.findMany();
	}

	public async findOne(userId: number): Promise<UserModel | null> {
		return this.persistanceService.findUnique(userId);
	}

	public async create(user: User): Promise<UserModel> {
		return this.persistanceService.create(user);
	}

	public async delete(userId: number): Promise<boolean> {
		return this.persistanceService.delete(userId);
	}
}
