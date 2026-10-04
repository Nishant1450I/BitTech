import { app } from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/database';
import { logger } from './utils/logger';

async function startServer() {
  try {
    const isDbConnected = await checkDatabaseConnection();
    if (isDbConnected) {
      logger.info('Database connected successfully.');
    } else {
      logger.warn('Database connection could not be established on startup. Will retry on request.');
    }

    const server = app.listen(env.PORT, env.HOST, () => {
      logger.info(`========================================================`);
      logger.info(`🗺️  DEAD INFRASTRUCTURE MAPPER BACKEND RUNNING`);
      logger.info(`🚀 Base URL:    http://localhost:${env.PORT}`);
      logger.info(`🩺 Health Check: http://localhost:${env.PORT}/api/health`);
      logger.info(`🌐 Allowed CORS: ${env.FRONTEND_URL}`);
      logger.info(`🤖 AI Provider:  ${env.HF_TOKEN ? 'Hugging Face (' + env.HF_MODEL + ')' : 'Heuristic Mode'}`);
      logger.info(`========================================================`);
    });

    const shutdown = () => {
      logger.info('Gracefully shutting down server...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server: ' + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

startServer();
