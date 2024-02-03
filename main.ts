// Packages
import dotenv from 'dotenv';
dotenv.config();
// Modules
import { FileSync } from './file_sync';
// Services
import { ConfigService } from './services/config.service';
// Utils
import { Logger } from './utils/logger';

const configService = new ConfigService();

const logger = new Logger(configService);

const fileSync = new FileSync(logger);

fileSync.start();
