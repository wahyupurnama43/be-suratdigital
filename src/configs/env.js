const dotenv = require('dotenv');

dotenv.config({
  override: false,
});

if (!process.env.URL_SERVER) throw new Error('Env: URL_SERVER is required');
if (!process.env.URL_CLIENT) throw new Error('Env: URL_CLIENT is required');
if (!process.env.DATABASE_URL) throw new Error('Env: DATABASE_URL is required');

module.exports = {
  appName: process.env.APP_NAME ?? 'App',
  appVersion: process.env.APP_VERSION ?? 'v1',
  appPort: process.env.APP_PORT ?? 8000,
  urlServer: process.env.URL_SERVER,
  urlClient: process.env.URL_CLIENT,
  databaseUrl: process.env.DATABASE_URL,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtSecret: process.env.JWT_SECRET,
};
