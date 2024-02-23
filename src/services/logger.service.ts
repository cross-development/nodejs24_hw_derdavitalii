// Packages
import { inject, injectable } from 'inversify';
import colors from 'colors/safe';
// Constants
import { TYPES } from '../constants/types';
// Utils
import { FileSystemFacade } from '../utils/fileSystem.facade';
// Types
import { TLoggerConfig } from '../types/app.config.interface';
import { ILoggerService } from './abstractions/logger.service.interface';
import { IConfigService } from './abstractions/config.service.interface';

/**
 * Simple logger to log info, warnings and errors.
 */
@injectable()
export class LoggerService implements ILoggerService {
	private fileSystemFacade: FileSystemFacade;
	private loggerConfig: TLoggerConfig;
	private logLevel: number;
	private levels: TLoggerConfig['levels'];

	constructor(@inject(TYPES.IConfigService) private readonly configService: IConfigService) {
		this.initializeLoggerConfig();
		this.initializeLogLevel();
		this.initializeColors();
	}

	/**
	 * Method for initializing the logger config
	 */
	private initializeLoggerConfig(): void {
		this.loggerConfig = this.configService.get<TLoggerConfig>('logger');

		if (this.loggerConfig.logToFile === 1) {
			this.fileSystemFacade = FileSystemFacade.getInstance();
		}
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
	 * @param dest - A destination, a write stream name, for logging to
	 * @param level - A level for logging ("info" | "warn" | "error")
	 * @param args - Any arguments for logging
	 */
	private logToFile(dest: 'infoStream' | 'errorStream', level: TLoggerConfig['logLevel'], args: unknown[]): void {
		const stream = this.fileSystemFacade[dest];

		const timestamp = new Date().toISOString();
		const logLevel = level.toUpperCase();
		const message = args.map((arg) => JSON.stringify(arg)).join('; ');

		stream.write(`${timestamp} [${logLevel}] [app]: ${message}\n`);
	}

	/**
	 * Method for logging information
	 * @param context - A context in which the logger is used
	 * @param args - Any arguments for logging
	 */
	public info(context: string, ...args: unknown[]): void {
		if (this.levels.info >= this.logLevel) {
			console.log(colors.bgBlue(`${context}:`), ...args);
		}

		if (this.fileSystemFacade) {
			this.logToFile('infoStream', 'info', args);
		}
	}

	/**
	 * Method for logging warnings
	 * @param context - A context in which the logger is used
	 * @param args - Any arguments for logging
	 */
	public warn(context: string, ...args: unknown[]): void {
		if (this.levels.warn >= this.logLevel) {
			console.warn(colors.bgYellow(`${context}:`), ...args);
		}

		if (this.fileSystemFacade) {
			this.logToFile('errorStream', 'warn', args);
		}
	}

	/**
	 * Method for logging errors
	 * @param context - A context in which the logger is used
	 * @param args - Any arguments for logging
	 */
	public error(context: string, ...args: unknown[]): void {
		if (this.levels.error >= this.logLevel) {
			console.error(colors.bgRed(`${context}:`), ...args);
		}

		if (this.fileSystemFacade) {
			this.logToFile('errorStream', 'error', args);
		}
	}
}
