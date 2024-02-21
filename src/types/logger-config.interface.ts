type TLoggerLevels = {
	info: 0;
	warn: 1;
	error: 2;
};

export interface ILoggerConfig {
	logLevel: 'info' | 'warn' | 'error';
	colorsEnabled: 1 | 0;
	levels: TLoggerLevels;
}
