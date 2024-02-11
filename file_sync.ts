// Core
import path from 'path';
import fs from 'fs/promises';
// Types
import { ILogger } from './types/logger.interface';
import { IFileSync } from './types/file-sync.interface';

/**
 * FileSync module to synchronize content from the source directory to the target directory.
 */
export class FileSync implements IFileSync {
	constructor(private readonly logger: ILogger) {}

	/**
	 * Method used to copy files and directories from the source directory to the target one.
	 * @param sourceDir - A source directory from which we should start copying files and directories
	 * @param targetDir - A target directory where we should copy all files to
	 * @param currentDir - A current directory where we are at the moment of copying files
	 */
	private async copyFiles(sourceDir: string, targetDir: string, currentDir: string): Promise<void> {
		try {
			const sourceDirectoryFiles = await fs.readdir(path.join(sourceDir, currentDir));

			for (const file of sourceDirectoryFiles) {
				const currentPath = path.join(currentDir, file);
				const sourcePath = path.join(sourceDir, currentDir, file);
				const targetPath = path.join(targetDir, currentDir, file);

				const sourcePathStats = await fs.stat(sourcePath);

				if (sourcePathStats.isDirectory()) {
					await fs.mkdir(targetPath, { recursive: true });
					await this.copyFiles(sourceDir, targetDir, currentPath);

					continue;
				}

				const sourceDestination = this.getRelativePath(path.join(sourceDir, currentDir));
				const targetDestination = this.getRelativePath(path.join(targetDir, currentDir));

				try {
					await fs.access(targetPath);

					this.logger.warn(`File ${file} already exists in ${targetDestination} directory.`);
				} catch (error: unknown) {
					await fs.copyFile(sourcePath, targetPath);

					this.logger.info(`File ${file} has been copied from ${sourceDestination} to ${targetDestination} directory.`);
				}
			}
		} catch (error: unknown) {
			const errorException = error as NodeJS.ErrnoException;

			this.logger.error(`Error while copying files. See: ${errorException.message}`);
		}
	}

	/**
	 * Method used to get a relative path from an absolute one.
	 * @param absolutePath - An absolute path from which to get the relative path
	 * @returns A relative path from the root directory
	 */
	private getRelativePath(absolutePath: string): string {
		return absolutePath.replace(__dirname, '');
	}

	/**
	 * Method used to start copying files from the source directory to the target one.
	 */
	public async start(): Promise<void> {
		const currentDir = path.sep;
		const sourceDir = path.join(__dirname, 'source');
		const targetDir = path.join(__dirname, 'target');

		await this.copyFiles(sourceDir, targetDir, currentDir);
	}
}
