export interface IAppConfig {
	logger: TLoggerConfig;
	server: TServerConfig;
}

export type TLoggerConfig = {
	logLevel: 'info' | 'warn' | 'error';
	logToFile: 1 | 0;
	colorsEnabled: 1 | 0;
	levels: {
		info: 0;
		warn: 1;
		error: 2;
	};
};

export type TServerConfig = {
	port: number;
};
