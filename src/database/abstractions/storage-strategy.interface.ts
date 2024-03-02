// Constants
import { MODELS } from '../../constants/models';

export interface IStorageStrategy<T> {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	registerModel(modelName: MODELS): void;
	getAll(): Promise<T[]>;
	getById(id: number): Promise<T | null>;
	create(data: Omit<T, 'id'>): Promise<T>;
	delete(id: number): Promise<boolean>;
}
