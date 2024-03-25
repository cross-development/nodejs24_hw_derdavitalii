const config = {
	logger: {
		levels: {
			info: 0,
			warn: 1,
			error: 2,
		},
		logLevel: process.env.LOG_LEVEL || 'warn',
		logToFile: Number(process.env.LOG_TO_FILE) || 0,
		colorsEnabled: Number(process.env.COLORS_ENABLED) || 0,
	},
	server: {
		port: Number(process.env.PORT) || 8000,
		allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
	},
	storage: {
		source: process.env.STORAGE_SOURCE || 'memory',
	},
};

export default config;
