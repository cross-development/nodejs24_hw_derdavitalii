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
import { StatusCode } from '../constants/statusCode.enum';
// Middleware
import { ValidateBodyMiddleware } from '../middleware/validate-body.middleware';
import { ValidateParamsMiddleware } from '../middleware/validate-params.middleware';
// Types
import { RequestType } from './abstractions/route.interface';
import { IUserController } from './abstractions/users.controller.interface';
import { IUserService } from '../services/abstractions/users.service.interface';
import { ILoggerService } from '../services/abstractions/logger.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.IUserService) private readonly userService: IUserService,
		@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService,
	) {
		super(loggerService);

		this.registerRoutes();
	}

	private registerRoutes(): void {
		this.bindRoutes([
			{ path: '/', method: 'get', handler: this.getAllUsers },
			{
				path: '/:userId',
				method: 'get',
				handler: this.getUserById,
				middleware: [new ValidateParamsMiddleware(UserParamsDto)],
			},
			{
				path: '/',
				method: 'post',
				handler: this.createUser,
				middleware: [new ValidateBodyMiddleware(CreateUserRequestDto)],
			},
			{
				path: '/:userId',
				method: 'delete',
				handler: this.deleteUser,
				middleware: [new ValidateParamsMiddleware(UserParamsDto)],
			},
		]);
	}

	public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		const users = await this.userService.getAllUsers();

		this.ok(res, users);
	}

	public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.getUserById(Number(req.params.userId));

		if (!user) {
			return next(new BusinessException(StatusCode.NotFound, 'User not found', 'getUserById'));
		}

		this.ok(res, user);
	}

	public async createUser(req: RequestType<CreateUserRequestDto>, res: Response, next: NextFunction): Promise<void> {
		await this.userService.createUser(req.body);

		this.created(res);
	}

	public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userId = Number(req.params.userId);

		const isUserDeleted = await this.userService.deleteUser(userId);

		if (!isUserDeleted) {
			return next(new BusinessException(StatusCode.NotFound, 'User not found', 'deleteUser'));
		}

		this.noContent(res);
	}
}
