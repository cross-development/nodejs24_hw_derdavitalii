const createLogger = moduleName => {
  const info = (...data) => {
    console.log(`${moduleName}:`, ...data);
  };

  const warn = (...data) => {
    console.warn(`${moduleName}:`, ...data);
  };

  const error = (...data) => {
    console.error(`${moduleName}:`, ...data);
  };

  return {
    info,
    warn,
    error,
  };
};

module.exports = createLogger;
