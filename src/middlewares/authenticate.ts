import { unauthorized } from '../lib/http-error';
import { validarToken } from '../lib/auth-client';
import { asyncHandler } from './async-handler';

/**
 * Protege rotas que exigem usuário autenticado. Extrai o Bearer token e o
 * valida junto ao serviço de autenticação, injetando o usuário em req.user.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw unauthorized('Credenciais de acesso ausentes', 'missing_token');
  }

  const token = header.slice('Bearer '.length).trim();
  req.user = await validarToken(token);
  next();
});
