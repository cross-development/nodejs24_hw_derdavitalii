// Packages
require('dotenv').config();
// Utils
const logger = require('./utils/logger')('main');

logger.info('info log - the script is running!');
logger.warn('warn log - the script is running!');
logger.error('error log - the script is running!');
