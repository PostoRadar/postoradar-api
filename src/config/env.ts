import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  AUTH_SERVICE_URL: z.string().url('AUTH_SERVICE_URL deve ser uma URL válida'),
  // Backend de mensageria para publicar eventos. 'log' apenas registra os
  // eventos (desenvolvimento); 'kafka' publica num broker real.
  MESSAGING_DRIVER: z.enum(['log', 'kafka']).default('log'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`Variáveis de ambiente inválidas:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
