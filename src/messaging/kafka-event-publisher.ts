import { Kafka, logLevel, type Producer } from 'kafkajs';
import { env } from '../config/env';
import type { EventPublisher } from './event-publisher';
import type { DomainEvent } from './events';

/**
 * Publica eventos num broker Kafka. A conexão é estabelecida de forma preguiçosa
 * na primeira publicação, evitando falhar a inicialização da API caso o broker
 * ainda não esteja no ar.
 */
export class KafkaEventPublisher implements EventPublisher {
  private readonly producer: Producer;
  private conectado = false;

  constructor() {
    const kafka = new Kafka({
      clientId: 'postoradar-api',
      brokers: env.KAFKA_BROKERS.split(',').map((b) => b.trim()),
      logLevel: logLevel.ERROR,
    });
    this.producer = kafka.producer();
  }

  private async garantirConexao(): Promise<void> {
    if (!this.conectado) {
      await this.producer.connect();
      this.conectado = true;
    }
  }

  async publicar(topico: string, evento: DomainEvent): Promise<void> {
    await this.garantirConexao();
    // A chave é o eventId; garante ordenação por partição e facilita deduplicação
    // do lado dos consumidores.
    await this.producer.send({
      topic: topico,
      messages: [{ key: evento.eventId, value: JSON.stringify(evento) }],
    });
  }

  async encerrar(): Promise<void> {
    if (this.conectado) {
      await this.producer.disconnect();
      this.conectado = false;
    }
  }
}
