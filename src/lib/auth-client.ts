import { env } from '../config/env';
import { serviceUnavailable, unauthorized } from './http-error';

export interface UsuarioAutenticado {
  sub: string;
  email: string;
  name: string;
  role: string;
}

interface ValidateResponse {
  valid: boolean;
  payload: UsuarioAutenticado;
}

/**
 * Delega ao serviço de autenticação a verificação de um access token.
 * A API principal não conhece o segredo do JWT — quem o valida é o auth,
 * mantendo a responsabilidade de credenciais isolada naquele serviço.
 */
export async function validarToken(token: string): Promise<UsuarioAutenticado> {
  let resposta: Response;

  try {
    resposta = await fetch(`${env.AUTH_SERVICE_URL}/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch {
    // Falha de rede: o serviço de auth está fora do ar ou inacessível.
    throw serviceUnavailable('Serviço de autenticação indisponível', 'auth_unavailable');
  }

  if (!resposta.ok) {
    throw unauthorized('Token inválido ou expirado', 'invalid_token');
  }

  const { payload } = (await resposta.json()) as ValidateResponse;
  return payload;
}
