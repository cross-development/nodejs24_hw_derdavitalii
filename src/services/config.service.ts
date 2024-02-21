// Packages
import config, { IConfig } from 'config';
// Types
import { IConfigService } from '../types/config.service.interface';

/**
 * ConfigureService used to provide access to the app configurations.
 */
export class ConfigService implements IConfigService {
	private static instance: ConfigService;

	private readonly config: IConfig;

	private constructor() {
		this.config = config;
	}

	/**
	 * Static method for getting the config service instance
	 * @returns The instance of the config service
	 */
	public static getInstance(): ConfigService {
		// Create the class instance if it does not exist.
		if (!ConfigService.instance) {
			ConfigService.instance = new ConfigService();
		}

		return ConfigService.instance;
	}

	/**
	 * Method used to retrieve any data from the configuration by key.
	 * @param key - A key that is used to retrieve a data from configuration.
	 * @returns A data from configuration.
	 */
	public get<T>(key: string): T {
		return this.config.get<T>(key);
	}

	/**
	 * Method used to check whether the configuration has data by key.
	 * @param key - A key that is used to check that the configuration has data for this key.
	 * @returns A boolean result of the check.
	 */
	public has(key: string): boolean {
		return this.config.has(key);
	}
}
