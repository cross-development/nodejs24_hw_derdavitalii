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
	private loggerConfig: ILoggerConfig;
	private logLevel: number;
	private levels: ILoggerConfig['levels'];
	private moduleName: string = 'main';

	constructor(private readonly configService: IConfigService) {
		this.initializeLoggerConfig();
		this.initializeLogLevel();
		this.initializeColors();
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
	 * Method for initializing the logger context
	 * @param moduleName - A context in which the logger will be used (a name of module)
	 * @returns The instance of the logger
	 */
	public init(moduleName: string): ILogger {
		this.moduleName = moduleName;

		return this;
	}

	/**
	 * Method for logging information
	 * @param args - Any arguments for logging
	 */
	public info(...args: unknown[]): void {
		if (this.levels.info >= this.logLevel) {
			console.log(colors.bgBlue(`${this.moduleName}:`), ...args);
		}
	}

	/**
	 * Method for logging warnings
	 * @param args - Any arguments for logging
	 */
	public warn(...args: unknown[]): void {
		if (this.levels.warn >= this.logLevel) {
			console.warn(colors.bgYellow(`${this.moduleName}:`), ...args);
		}
	}

	/**
	 * Method for logging errors
	 * @param args - Any arguments for logging
	 */
	public error(...args: unknown[]): void {
		if (this.levels.error >= this.logLevel) {
			console.error(colors.bgRed(`${this.moduleName}:`), ...args);
		}
	}
}
