import { env } from '../config/env';
import type { DomainEvent } from './events';

/**
 * Contrato de publicação de eventos de domínio. A regra de negócio depende
 * apenas desta interface — a implementação concreta (log, Kafka, ...) é
 * escolhida em tempo de inicialização, sem que os serviços precisem saber qual.
 */
export interface EventPublisher {
  publicar(topico: string, evento: DomainEvent): Promise<void>;
}

/**
 * Implementação de desenvolvimento: apenas registra o evento no log. Permite
 * exercitar o fluxo de publicação sem depender de um broker. Será trocada pela
 * implementação Kafka quando a mensageria estiver disponível (MESSAGING_DRIVER=kafka).
 */
class LogEventPublisher implements EventPublisher {
  async publicar(topico: string, evento: DomainEvent): Promise<void> {
    console.log(`[mensageria] evento publicado em "${topico}":`, JSON.stringify(evento));
  }
}

function criarEventPublisher(): EventPublisher {
  switch (env.MESSAGING_DRIVER) {
    case 'kafka':
      throw new Error('Publisher Kafka ainda não implementado — defina MESSAGING_DRIVER=log');
    case 'log':
    default:
      return new LogEventPublisher();
  }
}

export const eventPublisher = criarEventPublisher();
