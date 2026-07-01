import { env } from '../config/env';
import type { DomainEvent } from './events';

/**
 * Contrato de publicação de eventos de domínio. A regra de negócio depende
 * apenas desta interface — a implementação concreta (log, Kafka, ...) é
 * escolhida em tempo de inicialização, sem que os serviços precisem saber qual.
 */
export interface EventPublisher {
  publicar(topico: string, evento: DomainEvent): Promise<void>;
  encerrar(): Promise<void>;
}

/**
 * Implementação de desenvolvimento: apenas registra o evento no log. Permite
 * exercitar o fluxo de publicação sem depender de um broker.
 */
class LogEventPublisher implements EventPublisher {
  async publicar(topico: string, evento: DomainEvent): Promise<void> {
    console.log(`[mensageria] evento publicado em "${topico}":`, JSON.stringify(evento));
  }

  async encerrar(): Promise<void> {
    // Nada a encerrar.
  }
}

function criarEventPublisher(): EventPublisher {
  switch (env.MESSAGING_DRIVER) {
    case 'kafka': {
      // Import tardio: só carrega o kafkajs quando o driver Kafka é usado.
      const { KafkaEventPublisher } = require('./kafka-event-publisher') as typeof import('./kafka-event-publisher');
      return new KafkaEventPublisher();
    }
    case 'log':
    default:
      return new LogEventPublisher();
  }
}

export const eventPublisher = criarEventPublisher();
