import { createApp } from './app';
import { env } from './config/env';
import { disconnectPrisma } from './lib/prisma';
import { eventPublisher } from './messaging/event-publisher';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`postoradar-api ouvindo em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Encerramento gracioso: fecha o HTTP, o publisher de eventos e o banco.
async function shutdown(signal: string): Promise<void> {
  console.log(`\nRecebido ${signal}, encerrando...`);
  server.close(async () => {
    await eventPublisher.encerrar();
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
