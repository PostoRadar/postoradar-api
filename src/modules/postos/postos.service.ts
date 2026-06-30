import type { Combustivel, Posto, Preco } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { notFound } from '../../lib/http-error';
import type {
  AtualizarPrecoInput,
  CriarPostoInput,
  ListarPostosQuery,
} from './postos.validators';

export async function criarPosto(input: CriarPostoInput) {
  return prisma.posto.create({ data: input });
}

type PostoComPrecos = Posto & { precos: Preco[] };

// Preço de um combustível específico dentro de um posto (ou Infinity quando o
// posto não vende aquele combustível, para jogá-lo ao fim da ordenação).
function precoDoCombustivel(posto: PostoComPrecos, combustivel: Combustivel): number {
  const preco = posto.precos.find((p) => p.combustivel === combustivel);
  return preco ? Number(preco.valor) : Number.POSITIVE_INFINITY;
}

export async function listarPostos(filtros: ListarPostosQuery) {
  // O mapa exibe apenas postos ativos; um posto desativado some da listagem
  // sem que seu histórico seja perdido.
  const postos = await prisma.posto.findMany({
    where: {
      ativo: true,
      ...(filtros.cidade ? { cidade: { equals: filtros.cidade, mode: 'insensitive' } } : {}),
      ...(filtros.bandeira ? { bandeira: { equals: filtros.bandeira, mode: 'insensitive' } } : {}),
      // Ao filtrar por combustível, mostra só os postos que de fato o vendem.
      ...(filtros.combustivel ? { precos: { some: { combustivel: filtros.combustivel } } } : {}),
    },
    include: { precos: true },
    orderBy: { createdAt: 'desc' },
  });

  // Ordenação por menor preço é feita em memória: depende do valor de um
  // combustível específico (relação), o que o orderBy do Prisma não cobre.
  if (filtros.ordenarPor === 'preco' && filtros.combustivel) {
    const combustivel = filtros.combustivel;
    postos.sort((a, b) => precoDoCombustivel(a, combustivel) - precoDoCombustivel(b, combustivel));
  }

  return postos;
}

export async function buscarPosto(id: string) {
  const posto = await prisma.posto.findUnique({
    where: { id },
    include: { precos: true },
  });

  if (!posto) {
    throw notFound('Posto não encontrado');
  }

  return posto;
}

/**
 * Registra/atualiza o preço de um combustível em um posto. Mantemos apenas o
 * preço corrente por (posto, combustível); o histórico fica a cargo do serviço
 * de histórico, alimentado por eventos (a ser integrado via mensageria).
 */
export async function atualizarPreco(
  postoId: string,
  input: AtualizarPrecoInput,
  usuarioId: string,
) {
  // Garante que o posto existe antes de gravar o preço.
  await buscarPosto(postoId);

  return prisma.preco.upsert({
    where: { postoId_combustivel: { postoId, combustivel: input.combustivel } },
    create: {
      postoId,
      combustivel: input.combustivel,
      valor: input.valor,
      reportadoPor: usuarioId,
    },
    update: {
      valor: input.valor,
      reportadoPor: usuarioId,
    },
  });
}

export async function listarPrecos(postoId: string) {
  await buscarPosto(postoId);
  return prisma.preco.findMany({
    where: { postoId },
    orderBy: { combustivel: 'asc' },
  });
}
