// The Inversify config used to bind dependencies to the DI container
export const TYPES = {
	// App
	Application: Symbol.for('Application'),
	// Common
	MemoryStorage: Symbol.for('MemoryStorage'),
	ILoggerService: Symbol.for('LoggerService'),
	IConfigService: Symbol.for('ConfigService'),
	IExceptionFilter: Symbol.for('ExceptionFilter'),
	// Users
	IUserService: Symbol.for('UserService'),
	IUserController: Symbol.for('UserController'),
	IUserRepository: Symbol.for('IUserRepository'),
};
