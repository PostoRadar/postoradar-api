import { z } from 'zod';
import { Combustivel } from '@prisma/client';

// RN02: o preço deve ser positivo e dentro de uma faixa plausível, evitando
// valores absurdos digitados por engano (ou de má-fé) pela comunidade.
const PRECO_MINIMO = 1;
const PRECO_MAXIMO = 15;

const precoItemSchema = z.object({
  combustivel: z.nativeEnum(Combustivel),
  valor: z
    .number()
    .min(PRECO_MINIMO, `O preço deve ser de no mínimo R$ ${PRECO_MINIMO.toFixed(2)}`)
    .max(PRECO_MAXIMO, `O preço deve ser de no máximo R$ ${PRECO_MAXIMO.toFixed(2)}`),
});

// Campos básicos do posto, reaproveitados no cadastro e na atualização.
const postoBaseSchema = z.object({
  nome: z.string().trim().min(2, 'O nome do posto é obrigatório').max(160),
  bandeira: z.string().trim().min(2, 'A bandeira é obrigatória').max(80),
  endereco: z.string().trim().min(3, 'O endereço é obrigatório').max(240),
  bairro: z.string().trim().min(2, 'O bairro é obrigatório').max(120),
  cidade: z.string().trim().min(2, 'A cidade é obrigatória').max(120),
  estado: z.string().trim().length(2, 'O estado deve ser a sigla da UF (2 letras)').toUpperCase(),
  cep: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Cadastro aceita opcionalmente preços iniciais (UC09), sem combustível repetido.
export const criarPostoSchema = postoBaseSchema
  .extend({ precos: z.array(precoItemSchema).max(6).optional() })
  .refine(
    (data) => {
      if (!data.precos) return true;
      const tipos = data.precos.map((p) => p.combustivel);
      return new Set(tipos).size === tipos.length;
    },
    { message: 'Há combustível repetido na lista de preços iniciais', path: ['precos'] },
  );

// Atualização parcial do posto (inclui ativar/desativar). Todos os campos são
// opcionais, mas ao menos um precisa ser informado.
export const atualizarPostoSchema = postoBaseSchema
  .partial()
  .extend({ ativo: z.boolean().optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export const atualizarPrecoSchema = precoItemSchema;

export const listarPostosQuerySchema = z
  .object({
    cidade: z.string().trim().min(1).optional(),
    bandeira: z.string().trim().min(1).optional(),
    combustivel: z.nativeEnum(Combustivel).optional(),
    // 'recentes' (padrão) ou 'preco' (menor preço do combustível informado).
    ordenarPor: z.enum(['recentes', 'preco']).default('recentes'),
  })
  .refine((q) => q.ordenarPor !== 'preco' || q.combustivel !== undefined, {
    message: 'Para ordenar por preço, informe também o combustível',
    path: ['ordenarPor'],
  });

export type CriarPostoInput = z.infer<typeof criarPostoSchema>;
export type AtualizarPostoInput = z.infer<typeof atualizarPostoSchema>;
export type AtualizarPrecoInput = z.infer<typeof atualizarPrecoSchema>;
export type ListarPostosQuery = z.infer<typeof listarPostosQuerySchema>;
