// Models
import { UserModel } from '.prisma/client';
// Dto
import { CreateUserRequestDto } from '../../entities/dto/create-user-request.dto';

export interface IUserService {
	getAllUsers(): Promise<UserModel[]>;
	getUserById(userId: number): Promise<UserModel | null>;
	createUser(dto: CreateUserRequestDto): Promise<UserModel>;
	deleteUser(userId: number): Promise<boolean>;
}
