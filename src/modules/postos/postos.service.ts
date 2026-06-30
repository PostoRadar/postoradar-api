import { prisma } from '../../lib/prisma';
import { notFound } from '../../lib/http-error';
import type { AtualizarPrecoInput, CriarPostoInput } from './postos.validators';

export async function criarPosto(input: CriarPostoInput) {
  return prisma.posto.create({ data: input });
}

export async function listarPostos(filtros: { cidade?: string }) {
  return prisma.posto.findMany({
    where: filtros.cidade
      ? { cidade: { equals: filtros.cidade, mode: 'insensitive' } }
      : undefined,
    include: { precos: true },
    orderBy: { createdAt: 'desc' },
  });
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
