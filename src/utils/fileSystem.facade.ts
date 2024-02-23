// Core
import path from 'path';
import fs, { WriteStream } from 'fs';

/**
 * The wrapper (facade) for the file system operations.
 */
export class FileSystemFacade {
	private static instance: FileSystemFacade;

	private infoFileStream: WriteStream;
	private errorFileStream: WriteStream;

	private constructor() {
		this.initializeStreams();
	}

	/**
	 * Static method for getting the file system facade instance
	 * @returns The instance of the file system facade
	 */
	public static getInstance(): FileSystemFacade {
		// Create the class instance if it does not exist.
		if (!FileSystemFacade.instance) {
			FileSystemFacade.instance = new FileSystemFacade();
		}

		return FileSystemFacade.instance;
	}

	/**
	 * Method for initializing the info and error streams.
	 */
	private initializeStreams(): void {
		const logsDir = path.join(__dirname, '..', '..', 'logs');

		// Create the logs directory if it does not exist.
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir);
		}

		// flags: 'a' - Open file for appending. The file is created if it does not exist.
		// See: https://nodejs.org/docs/latest/api/fs.html#file-system-flags
		this.infoFileStream = fs.createWriteStream(path.join(logsDir, 'info.log'), { flags: 'a' });
		this.errorFileStream = fs.createWriteStream(path.join(logsDir, 'errors.log'), { flags: 'a' });

		// Close the info and error file streams before closing the program.
		process.on('beforeExit', () => {
			this.infoFileStream.end();
			this.errorFileStream.end();
		});
	}

	/**
	 * Getter for the infoStream
	 */
	public get infoStream(): WriteStream {
		return this.infoFileStream;
	}

	/**
	 * Getter for the errorStream
	 */
	public get errorStream(): WriteStream {
		return this.errorFileStream;
	}
}
