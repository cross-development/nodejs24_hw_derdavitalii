// Packages
import colors from 'colors/safe';
// Utils
import { FileSystemFacade } from '../utils/fileSystem.facade';
// Types
import { ILogger } from '../types/logger.interface';
import { ILoggerConfig } from '../types/logger-config.interface';
import { IConfigService } from '../types/config.service.interface';

/**
 * Simple logger to log info, warnings and errors.
 */
export class Logger implements ILogger {
	private static fileSystemFacade: FileSystemFacade;

	private loggerConfig: ILoggerConfig;
	private logLevel: number;
	private levels: ILoggerConfig['levels'];

	constructor(
		private readonly moduleName: string,
		private readonly configService: IConfigService,
	) {
		this.initializeLoggerConfig();
		this.initializeLogLevel();
		this.initializeColors();
	}

	/**
	 * Uses FileSystemFacade as an injectable option without any hard dependencies
	 * @param fileSystemFacade
	 */
	public static useFileSystemFacade(fileSystemFacade: FileSystemFacade): void {
		this.fileSystemFacade = fileSystemFacade;
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
	 * Method for logging a message to the log files
	 * @param streamName - A write stream name for logging to
	 * @param level - A level for logging ("info" | "warn" | "error")
	 * @param args - Any arguments for logging
	 */
	private logToFile(streamName: 'infoStream' | 'errorStream', level: ILoggerConfig['logLevel'], args: unknown[]): void {
		const stream = Logger.fileSystemFacade[streamName];

		const timestamp = new Date().toISOString();
		const logLevel = level.toUpperCase();
		const message = args.map((arg) => JSON.stringify(arg)).join('; ');

		stream.write(`${timestamp} [${logLevel}] [${this.moduleName}]: ${message}\n`);
	}

	/**
	 * Method for logging information
	 * @param args - Any arguments for logging
	 */
	public info(...args: unknown[]): void {
		if (this.levels.info >= this.logLevel) {
			console.log(colors.bgBlue(`${this.moduleName}:`), ...args);
		}

		this.logToFile('infoStream', 'info', args);
	}

	/**
	 * Method for logging warnings
	 * @param args - Any arguments for logging
	 */
	public warn(...args: unknown[]): void {
		if (this.levels.warn >= this.logLevel) {
			console.warn(colors.bgYellow(`${this.moduleName}:`), ...args);
		}

		this.logToFile('errorStream', 'warn', args);
	}

	/**
	 * Method for logging errors
	 * @param args - Any arguments for logging
	 */
	public error(...args: unknown[]): void {
		if (this.levels.error >= this.logLevel) {
			console.error(colors.bgRed(`${this.moduleName}:`), ...args);
		}

		this.logToFile('errorStream', 'error', args);
	}
}
