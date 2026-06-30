/**
 * Erro de aplicação com status HTTP associado. Lançado pelas camadas de
 * serviço e tratado de forma centralizada pelo middleware de erros.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code = 'error') {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message: string, code = 'bad_request') => new HttpError(400, message, code);
export const unauthorized = (message: string, code = 'unauthorized') => new HttpError(401, message, code);
export const notFound = (message: string, code = 'not_found') => new HttpError(404, message, code);
export const conflict = (message: string, code = 'conflict') => new HttpError(409, message, code);
export const serviceUnavailable = (message: string, code = 'service_unavailable') =>
  new HttpError(503, message, code);
