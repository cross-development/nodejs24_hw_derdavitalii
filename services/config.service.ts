// Packages
import config, { IConfig } from 'config';
// Types
import { IConfigService } from '../types/config.service.interface';

export class ConfigService implements IConfigService {
	private readonly config: IConfig;

	constructor() {
		this.config = config;
	}

	public get<T>(key: string): T {
		return this.config.get<T>(key);
	}

	public has(key: string): boolean {
		return this.config.has(key);
	}
}
