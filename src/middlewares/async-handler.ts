import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Encapsula handlers assíncronos para que rejeições de Promise sejam
 * encaminhadas ao middleware de erros sem precisar de try/catch em cada rota.
 */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
