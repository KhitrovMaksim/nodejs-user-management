const DATABASE_USER = process.env.NODEJS_USER_MANAGEMENT_DB_USER;
const DATABASE_PASSWORD = process.env.NODEJS_USER_MANAGEMENT_DB_PASSWORD;

module.exports = {
  DATABASE_URL: `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@nodejs.pa7mngq.mongodb.net/?retryWrites=true&w=majority`,
  PRETTY_LOGGING: process.env.PRETTY_LOGGING,
  PORT: process.env.PORT,
  SECRET: 'secret key for jwt',
};
