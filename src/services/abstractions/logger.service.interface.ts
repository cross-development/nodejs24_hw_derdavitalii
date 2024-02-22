export interface ILoggerService {
	info(context: string, ...args: unknown[]): void;
	error(context: string, ...args: unknown[]): void;
	warn(context: string, ...args: unknown[]): void;
}
