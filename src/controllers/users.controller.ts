// Packages
import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
// Controllers
import { BaseController } from '../controllers/abstractions/base.controller';
// Dto
import { UserParamsDto } from '../entities/dto/user-params.dto';
import { CreateUserRequestDto } from '../entities/dto/create-user-request.dto';
// Errors
import { BusinessException } from '../exceptions/business-exception';
// Constants
import { TYPES } from '../constants/types';
import { StatusCode } from '../constants/status-code.enum';
// Middleware
import { ValidateMiddleware } from '../middleware/validate.middleware';
// Types
import { RequestType } from './abstractions/route.interface';
import { IUserController } from './abstractions/users.controller.interface';
import { IUserService } from '../services/abstractions/users.service.interface';
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * A user controller is used to perform CRUD operations on the user
 */
@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.IUserService) private readonly userService: IUserService,
		@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService,
	) {
		super(loggerService);

		this.registerRoutes();
	}

	/**
	 * Method is used to define and bind all endpoints in the controller
	 */
	private registerRoutes(): void {
		this.bindRoutes([
			{ path: '/', method: 'get', handler: this.getAllUsers },
			{
				path: '/:userId',
				method: 'get',
				handler: this.getUserById,
				middleware: [new ValidateMiddleware(UserParamsDto, 'params')],
			},
			{
				path: '/',
				method: 'post',
				handler: this.createUser,
				middleware: [new ValidateMiddleware(CreateUserRequestDto)],
			},
			{
				path: '/:userId',
				method: 'delete',
				handler: this.deleteUser,
				middleware: [new ValidateMiddleware(UserParamsDto, 'params')],
			},
		]);
	}

	/**
	 * Method is used to get the list of users
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 */
	public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		const users = await this.userService.getAllUsers();

		this.ok(res, users);
	}

	/**
	 * Method is used to get a user by id
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 * @returns - If there is no user for the provided id, the business exception is returned
	 */
	public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.getUserById(Number(req.params.userId));

		if (!user) {
			return next(new BusinessException(StatusCode.NotFound, 'User not found', '[UserController]'));
		}

		this.ok(res, user);
	}

	/**
	 * Method is used to create user base on the provided data
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 */
	public async createUser(req: RequestType<CreateUserRequestDto>, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.createUser(req.body);

		this.created(res, user);
	}

	/**
	 * Method is used to delete a user by id
	 * @param req - The express request
	 * @param res - The express response
	 * @param next - The next function called to pass the request further
	 * @returns - If there is no user for the provided id, the business exception is returned
	 */
	public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userId = Number(req.params.userId);

		const isUserDeleted = await this.userService.deleteUser(userId);

		if (!isUserDeleted) {
			return next(new BusinessException(StatusCode.NotFound, 'User not found', '[UserController]'));
		}

		this.noContent(res);
	}
}
