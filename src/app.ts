import cors from 'cors';
import express, { type Application, Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { postosRoutes } from './modules/postos/postos.routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  const api = Router();
  api.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'postoradar-api', timestamp: new Date().toISOString() });
  });
  api.use('/postos', postosRoutes);

  app.use('/api', api);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
