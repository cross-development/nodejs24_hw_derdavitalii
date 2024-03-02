// Database
import { ApplicationDbContext } from '../application-db.context';
// Constants
import { MODELS } from '../../constants/models';
// Types
import { IBaseModel } from './base-model.interface';

export interface IStorageManager {
	initialize(): Promise<void>;
	dispose(): Promise<void>;
	getApplicationDbContext<T extends IBaseModel>(modelName: MODELS): ApplicationDbContext<T>;
}
