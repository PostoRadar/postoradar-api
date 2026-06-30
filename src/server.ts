import { createApp } from './app';
import { env } from './config/env';
import { disconnectPrisma } from './lib/prisma';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`postoradar-api ouvindo em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Encerramento gracioso: fecha o HTTP e a conexão com o banco.
async function shutdown(signal: string): Promise<void> {
  console.log(`\nRecebido ${signal}, encerrando...`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
