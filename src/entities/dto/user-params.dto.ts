// Packages
import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserParamsDto {
	@Transform(({ value }) => Number(value))
	@IsInt({ message: 'userId must be an integer' })
	@Min(0, { message: 'userId must be a non-negative integer' })
	userId: number;
}
