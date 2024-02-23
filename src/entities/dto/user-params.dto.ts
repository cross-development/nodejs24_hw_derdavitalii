// Packages
import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * A user params DTO used to validate the data obtained from the request to get or delete a user
 */
export class UserParamsDto {
	@Transform(({ value }) => Number(value))
	@IsInt({ message: 'userId must be an integer' })
	@Min(0, { message: 'userId must be a non-negative integer' })
	userId: number;
}
