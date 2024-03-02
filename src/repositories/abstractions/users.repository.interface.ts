// Entities
import { User } from '../../entities/user.entity';
// Models
import { UserModel } from '.prisma/client';

export interface IUserRepository {
	getAll(): Promise<UserModel[]>;
	getById(userId: number): Promise<UserModel | null>;
	create(user: User): Promise<UserModel>;
	delete(userId: number): Promise<boolean>;
}
