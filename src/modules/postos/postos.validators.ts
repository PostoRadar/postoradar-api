import { z } from 'zod';
import { Combustivel } from '@prisma/client';

export const criarPostoSchema = z.object({
  nome: z.string().trim().min(2, 'O nome do posto é obrigatório').max(160),
  bandeira: z.string().trim().min(2, 'A bandeira é obrigatória').max(80),
  cidade: z.string().trim().min(2, 'A cidade é obrigatória').max(120),
  endereco: z.string().trim().min(3, 'O endereço é obrigatório').max(240),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const atualizarPrecoSchema = z.object({
  combustivel: z.nativeEnum(Combustivel),
  valor: z.number().positive('O valor deve ser positivo').max(999.999),
});

export const listarPostosQuerySchema = z.object({
  cidade: z.string().trim().min(1).optional(),
});

export type CriarPostoInput = z.infer<typeof criarPostoSchema>;
export type AtualizarPrecoInput = z.infer<typeof atualizarPrecoSchema>;
