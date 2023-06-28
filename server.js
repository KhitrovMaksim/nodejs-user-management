const express = require('express');
const mongoose = require('mongoose').default;
const { PORT, DATABASE_URL } = require('./config');
const logger = require('./logger');
const router = require('./server/router/routes');

const userManagementServer = express();
userManagementServer.use(express.json());
userManagementServer.use('/', router);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(
      DATABASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => logger.info('Database connection established.'),
    );
    const server = userManagementServer.listen(PORT, () =>
      logger.info(`Server started on port ${PORT}.`),
    );

    const stopServer = (type) => {
      logger.info(`HTTP server closed by ${type}.`);
      mongoose.connection.close();
      server.close();
      process.exit(0);
    };

    process.once('SIGINT', () => stopServer('SIGINT'));
    process.once('SIGTERM', () => stopServer('SIGTERM'));
  } catch (e) {
    logger.error(e);
  }
};

start().catch((error) => logger.error(error));
