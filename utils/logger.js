const createLogger = moduleName => {
  const info = message => {
    console.log(`${moduleName}: ${message}`);
  };

  const warn = message => {
    console.warn(`${moduleName}: ${message}`);
  };

  const error = message => {
    console.error(`${moduleName}: ${message}`);
  };

  return {
    info,
    warn,
    error,
  };
};

module.exports = createLogger;
