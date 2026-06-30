import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { HttpError } from '../lib/http-error';

interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: { code: 'not_found', message: `Rota não encontrada: ${req.method} ${req.path}` },
  } satisfies ErrorBody);
}

// O Express identifica este middleware como tratador de erros pela aridade (4 args).
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        code: 'validation_error',
        message: 'Dados inválidos na requisição',
        details: err.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message })),
      },
    } satisfies ErrorBody);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message },
    } satisfies ErrorBody);
    return;
  }

  if (env.NODE_ENV !== 'test') {
    console.error('Erro não tratado:', err);
  }

  res.status(500).json({
    error: { code: 'internal_error', message: 'Erro interno no servidor' },
  } satisfies ErrorBody);
}
