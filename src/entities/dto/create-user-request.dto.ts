// Packages
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * A create user DTO used to validate the data obtained from the request to create a new user
 */
export class CreateUserRequestDto {
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Please enter a valid email address' })
	email: string;

	@IsNotEmpty({ message: 'Username is required' })
	@IsString({ message: 'Username must be a string' })
	username: string;
}
