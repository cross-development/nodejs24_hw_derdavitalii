// Packages
import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	getAllUsers(req: Request, res: Response, next: NextFunction): void;
	getUserById(req: Request, res: Response, next: NextFunction): void;
	createUser(req: Request, res: Response, next: NextFunction): void;
	deleteUser(req: Request, res: Response, next: NextFunction): void;
}
