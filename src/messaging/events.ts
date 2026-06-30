import type { Combustivel } from '@prisma/client';

// Tópico (fila) onde a atualização de preço é publicada. Consumido pelos
// serviços de Histórico (grava o registro) e Notificações (push em tempo real).
export const TOPICO_PRECO_ATUALIZADO = 'preco-atualizado';

export interface DomainEvent {
  evento: string;
  eventId: string;
  ocorridoEm: string; // ISO-8601
}

export interface PrecoAtualizadoEvent extends DomainEvent {
  evento: typeof TOPICO_PRECO_ATUALIZADO;
  dados: {
    postoId: string;
    nomePosto: string;
    bairro: string;
    cidade: string;
    latitude: number;
    longitude: number;
    combustivel: Combustivel;
    valor: number;
    reportadoPor: string;
    atualizadoEm: string;
  };
}
