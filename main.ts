// Packages
import dotenv from 'dotenv';
dotenv.config();
// Modules
import { FileSync } from './file_sync';
// Services
import { Logger } from './services/logger.service';
import { ConfigService } from './services/config.service';
// Utils
import { FileSystemFacade } from './utils/fileSystem.facade';

const configService = ConfigService.getInstance();

Logger.useFileSystemFacade(FileSystemFacade.getInstance());

const mainLogger = new Logger('Main', configService);
const fileSyncLogger = new Logger('FileSync', configService);

mainLogger.info('Info message from Main');

const fileSync = new FileSync(fileSyncLogger);

mainLogger.warn('Warn message from Main');

fileSync.start();

mainLogger.error('Error message from Main', { options: ['fight', 'flight'] });
