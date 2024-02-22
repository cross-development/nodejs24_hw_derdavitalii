// Packages
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Email is not correct' })
	email: string;

	@IsNotEmpty({ message: 'Username is required' })
	@IsString({ message: 'Username must be a string' })
	username: string;
}
