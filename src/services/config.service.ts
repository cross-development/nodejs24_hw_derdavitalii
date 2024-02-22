// Packages
import { injectable } from 'inversify';
import config, { IConfig } from 'config';
// Types
import { IConfigService } from './abstractions/config.service.interface';

/**
 * ConfigureService used to provide access to the app configurations.
 */
@injectable()
export class ConfigService implements IConfigService {
	private readonly config: IConfig;

	constructor() {
		this.config = config;
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
