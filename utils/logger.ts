// Core
import fs, { WriteStream } from 'fs';
import path from 'path';
// Packages
import colors from 'colors/safe';
// Types
import { ILogger } from '../types/logger.interface';
import { ILoggerConfig } from '../types/logger-config.interface';
import { IConfigService } from '../types/config.service.interface';

/**
 * Simple logger to log info, warnings and errors.
 * Logs arguments using this pattern - 'moduleName: all_passed_arguments'.
 */
export class Logger implements ILogger {
	private static instance: Logger;

	private loggerConfig: ILoggerConfig;
	private logLevel: number;
	private levels: ILoggerConfig['levels'];
	private moduleName: string = 'main';
	private infoStream: WriteStream;
	private errorStream: WriteStream;

	private constructor(private readonly configService: IConfigService) {
		this.initializeLoggerConfig();
		this.initializeLogLevel();
		this.initializeColors();
		this.initializeStreams();
	}

	/**
	 * Method for initializing the logger config
	 */
	private initializeLoggerConfig(): void {
		this.loggerConfig = this.configService.get<ILoggerConfig>('logger');
	}

	/**
	 * Method for initializing the logger level
	 */
	private initializeLogLevel(): void {
		this.levels = this.loggerConfig.levels;
		this.logLevel = this.levels[this.loggerConfig.logLevel] ?? this.levels.warn;
	}

	/**
	 * Method for initializing the logger colors
	 */
	private initializeColors(): void {
		this.loggerConfig.colorsEnabled === 1 ? colors.enable() : colors.disable();
	}

	/**
	 * Method for initializing the info and error streams.
	 */
	private initializeStreams(): void {
		const logsDir = path.join('.', 'logs');

		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir);
		}

		// flags: 'a' - Open file for appending. The file is created if it does not exist.
		// See: https://nodejs.org/docs/latest/api/fs.html#file-system-flags
		this.infoStream = fs.createWriteStream(path.join(logsDir, 'info.log'), { flags: 'a' });
		this.errorStream = fs.createWriteStream(path.join(logsDir, 'errors.log'), { flags: 'a' });

		process.on('beforeExit', () => {
			this.infoStream.end();
			this.errorStream.end();
		});
	}

	/**
	 * Method for formatting log message to log in the file
	 * @param level - A level for logging ("info" | "warn" | "error")
	 * @param args - Any arguments for logging
	 * @returns A log message in pattern 'timestamp [level] [moduleName]: all_passed_arguments'
	 */
	private formatLogMessage(level: ILoggerConfig['logLevel'], args: unknown[]): string {
		const timestamp = new Date().toISOString();
		const logLevel = level.toUpperCase();
		const message = args.join('; ');

		return `${timestamp} [${logLevel}] [${this.moduleName}]: ${message}\n`;
	}

	/**
	 * Method for initializing the logger context
	 * @param moduleName - A context in which the logger will be used (a name of module)
	 * @returns The instance of the logger
	 */
	public init(moduleName: string): Logger {
		this.moduleName = moduleName;

		return this;
	}

	/**
	 * Method for getting the logger instance
	 * @param moduleName - A context in which the logger will be used (a name of a module)
	 * @param configService - A configuration service to provide access to the app configurations.
	 * @returns The instance of the logger
	 */
	public static getInstance(configService: IConfigService): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger(configService);
		}

		return Logger.instance;
	}

	/**
	 * Method for logging information
	 * @param args - Any arguments for logging
	 */
	public info(...args: unknown[]): void {
		if (this.levels.info >= this.logLevel) {
			console.log(colors.bgBlue(`${this.moduleName}:`), ...args);
		}

		this.infoStream.write(this.formatLogMessage('info', args));
	}

	/**
	 * Method for logging warnings
	 * @param args - Any arguments for logging
	 */
	public warn(...args: unknown[]): void {
		if (this.levels.warn >= this.logLevel) {
			console.warn(colors.bgYellow(`${this.moduleName}:`), ...args);
		}

		this.errorStream.write(this.formatLogMessage('warn', args));
	}

	/**
	 * Method for logging errors
	 * @param args - Any arguments for logging
	 */
	public error(...args: unknown[]): void {
		if (this.levels.error >= this.logLevel) {
			console.error(colors.bgRed(`${this.moduleName}:`), ...args);
		}

		this.errorStream.write(this.formatLogMessage('error', args));
	}
}
