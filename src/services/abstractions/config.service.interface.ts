export interface IConfigService {
	get<T>(key: string): T;
	has(key: string): boolean;
}
