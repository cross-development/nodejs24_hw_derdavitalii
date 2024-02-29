// Packages
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
// Constants
import { TYPES } from '../constants/types';
// Types
import { ILoggerService } from '../services/abstractions/logger.service.interface';

/**
 * Prisma client is used to interact with a database.
 */
@injectable()
export class PrismaService {
	public readonly client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService) {
		this.client = new PrismaClient();
	}

	/**
	 * Method is used to connect to the prisma client.
	 */
	public async connect(): Promise<void> {
		try {
			await this.client.$connect();

			this.loggerService.info('[PrismaService]', 'Connected successfully');
		} catch (error) {
			if (error instanceof Error) {
				this.loggerService.error('[PrismaService]', 'Failed: ' + error.message);
			}
		}
	}

	/**
	 * Method is used to disconnect from the prisma client.
	 */
	public async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
