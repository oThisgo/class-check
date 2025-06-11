const databaseConfig = require('./database');
const jwtConfig = require('./jwt');

module.exports = {
  database: databaseConfig,
  jwt: jwtConfig,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};