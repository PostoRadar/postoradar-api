import { Router } from 'express';
import { asyncHandler } from '../../middlewares/async-handler';
import { authenticate } from '../../middlewares/authenticate';
import * as postosController from './postos.controller';

const router = Router();

// Leitura é pública; escrita exige usuário autenticado (colaboração da comunidade).
router.get('/', asyncHandler(postosController.listar));
router.get('/:id', asyncHandler(postosController.detalhar));
router.get('/:id/precos', asyncHandler(postosController.listarPrecos));

router.post('/', authenticate, asyncHandler(postosController.criar));
router.put('/:id/precos', authenticate, asyncHandler(postosController.atualizarPreco));

export { router as postosRoutes };
