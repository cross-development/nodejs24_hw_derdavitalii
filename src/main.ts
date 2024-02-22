// Packages
import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import dotenv from 'dotenv';
dotenv.config();
// Application
import { App } from './app';
// Services
import { UserService } from './services/users.service';
import { LoggerService } from './services/logger.service';
import { ConfigService } from './services/config.service';
// Database
import { PersistenceService } from './database/persistence.service';
// Controllers
import { UserController } from './controllers/users.controller';
// Repositories
import { UserRepository } from './repositories/users.repository';
// Errors
import { ExceptionFilter } from './exceptions/exception.filter';
// Constants
import { TYPES } from './constants/types';
// Types
import { IBootstrapReturn } from './types/app.interface';
import { IUserService } from './services/abstractions/users.service.interface';
import { IConfigService } from './services/abstractions/config.service.interface';
import { ILoggerService } from './services/abstractions/logger.service.interface';
import { IExceptionFilter } from './exceptions/abstractions/exception.filter.interface';
import { IUserController } from './controllers/abstractions/users.controller.interface';
import { IUserRepository } from './repositories/abstractions/users.repository.interface';

// Bind all the dependencies for the DI container
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// Common
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
	// Database
	bind<PersistenceService>(TYPES.PersistenceService).to(PersistenceService).inSingletonScope();
	// Users
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<IUserController>(TYPES.IUserController).to(UserController).inSingletonScope();
	// Application
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

// The bootstrap function to start the server
const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
};

bootstrap();
