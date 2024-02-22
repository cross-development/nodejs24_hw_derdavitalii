export const TYPES = {
	// App
	Application: Symbol.for('Application'),
	PersistenceService: Symbol.for('PersistenceService'),
	// Common
	ILoggerService: Symbol.for('LoggerService'),
	IConfigService: Symbol.for('ConfigService'),
	IExceptionFilter: Symbol.for('ExceptionFilter'),
	// Users
	IUserService: Symbol.for('UserService'),
	IUserController: Symbol.for('UserController'),
	IUserRepository: Symbol.for('IUserRepository'),
};
