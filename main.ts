// Packages
import dotenv from 'dotenv';
dotenv.config();
// Application
import { App } from './app';
// Services
import { Logger } from './services/logger.service';
import { ConfigService } from './services/config.service';
// Utils
import { FileSystemFacade } from './utils/fileSystem.facade';

// The bootstrap function to start the server
const bootstrap = (): void => {
	const configService = ConfigService.getInstance();

	const appLogger = new Logger('App', configService);
	Logger.useFileSystemFacade(FileSystemFacade.getInstance());

	const app = new App(appLogger, configService);

	app.init();
};

bootstrap();
