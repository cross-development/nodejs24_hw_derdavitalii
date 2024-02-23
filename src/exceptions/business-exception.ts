/**
 * Custom business exception using in the app
 */
export class BusinessException extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly message: string,
		public readonly context: string,
	) {
		super(message);
	}
}
