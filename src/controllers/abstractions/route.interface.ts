// Packages
import { Request, Response, NextFunction, Router } from 'express';
// Types
import { IMiddleware } from '../../middleware/abstractions/middleware.interface';

export interface IControllerRoute {
	path: string;
	middleware?: IMiddleware[];
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	handler(req: Request, res: Response, next: NextFunction): void;
}

export type ExpressReturnType = Response<any, Record<string, any>>;

export type RequestType<T = any> = Request<{}, {}, T>;
