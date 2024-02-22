export class User {
	constructor(
		private readonly _email: string,
		private readonly _username: string,
	) {}

	public get email(): string {
		return this._email;
	}

	public get username(): string {
		return this._username;
	}
}
