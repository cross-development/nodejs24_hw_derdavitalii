// Packages
const config = require('config');
const colors = require('colors/safe');

/**
 * Simple logger for logging info, warnings and errors.
 * Logs arguments using this pattern - 'moduleName: all_passed_arguments'
 * @returns The init method that gets a module name and initializes the logger.
 */
function logger() {
  /**
   * Local variables for logger
   */
  let context;
  let currentLogLevel;

  const levels = {
    info: 0,
    warn: 1,
    error: 2,
  };

  /**
   * Init logger and setup all logger configurations
   * @param {string} moduleName A context in which the logger will be used (a name of module)
   * @returns Object of methods for logging information, warnings and errors
   */
  function init(moduleName) {
    context = moduleName;

    configureLogLevel();
    configureColors();

    return { info, warn, error };
  }

  /**
   * Method for configuring logger level
   */
  function configureLogLevel() {
    const logLevel = config.get('logLevel');
    currentLogLevel = levels[logLevel] ?? levels.warn;
  }

  /**
   * Method for configuring logger colors
   */
  function configureColors() {
    const colorsEnabled = config.get('colorsEnabled');

    if (Number(colorsEnabled) === 1) {
      colors.enable();
    } else {
      colors.disable();
    }
  }

  /**
   * Method for logging information.
   * @param  {...any} data - Any arguments for logging
   */
  function info(...data) {
    if (levels.info >= currentLogLevel) {
      console.log(colors.bgBlue(`${context}:`), ...data);
    }
  }

  /**
   * Method for logging warnings
   * @param  {...any} data - Any arguments for logging
   */
  function warn(...data) {
    if (levels.warn >= currentLogLevel) {
      console.warn(colors.bgYellow(`${context}:`), ...data);
    }
  }

  /**
   * Method for logging errors
   * @param  {...any} data - Any arguments for logging
   */
  function error(...data) {
    if (levels.error >= currentLogLevel) {
      console.error(colors.bgRed(`${context}:`), ...data);
    }
  }

  return { init };
}

module.exports = logger().init;
