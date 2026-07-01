import type { Request, Response } from 'express';
import * as postosService from './postos.service';
import {
  atualizarPostoSchema,
  atualizarPrecoSchema,
  criarPostoSchema,
  listarPostosQuerySchema,
} from './postos.validators';

export async function criar(req: Request, res: Response): Promise<void> {
  const data = criarPostoSchema.parse(req.body);
  const posto = await postosService.criarPosto(data, req.user!.sub);
  res.status(201).json(posto);
}

export async function listar(req: Request, res: Response): Promise<void> {
  const filtros = listarPostosQuerySchema.parse(req.query);
  const postos = await postosService.listarPostos(filtros);
  res.status(200).json(postos);
}

export async function detalhar(req: Request, res: Response): Promise<void> {
  const posto = await postosService.buscarPosto(req.params.id);
  res.status(200).json(posto);
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const data = atualizarPostoSchema.parse(req.body);
  const posto = await postosService.atualizarPosto(req.params.id, data);
  res.status(200).json(posto);
}

export async function atualizarPreco(req: Request, res: Response): Promise<void> {
  const data = atualizarPrecoSchema.parse(req.body);
  const preco = await postosService.atualizarPreco(req.params.id, data, req.user!.sub);
  res.status(200).json(preco);
}

export async function listarPrecos(req: Request, res: Response): Promise<void> {
  const precos = await postosService.listarPrecos(req.params.id);
  res.status(200).json(precos);
}
