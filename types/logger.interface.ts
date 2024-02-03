export interface ILogger {
	init(moduleName: string): ILogger;
	info(...args: unknown[]): void;
	error(...args: unknown[]): void;
	warn(...args: unknown[]): void;
}
