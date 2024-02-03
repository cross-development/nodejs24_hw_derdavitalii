const config = {
	logger: {
		levels: {
			info: 0,
			warn: 1,
			error: 2,
		},
		logLevel: process.env.LOG_LEVEL ?? 'warn',
		colorsEnabled: Number(process.env.COLORS_ENABLED) ?? 0,
	},
};

export default config;
