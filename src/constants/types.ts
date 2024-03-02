// These types of the app classes are used to bind dependencies to the DI container
export const TYPES = {
	// App
	Application: Symbol.for('Application'),
	// Database
	IStorageManager: Symbol.for('IStorageManager'),
	ApplicationDbContext: Symbol.for('ApplicationDbContext'),
	// Common
	ILoggerService: Symbol.for('LoggerService'),
	IConfigService: Symbol.for('ConfigService'),
	IExceptionFilter: Symbol.for('ExceptionFilter'),
	// Users
	IUserService: Symbol.for('UserService'),
	IUserController: Symbol.for('UserController'),
	IUserRepository: Symbol.for('IUserRepository'),
};
