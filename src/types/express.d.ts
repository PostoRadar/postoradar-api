import type { UsuarioAutenticado } from '../lib/auth-client';

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioAutenticado;
    }
  }
}

export {};
