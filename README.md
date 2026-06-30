# postoradar-api

API principal do **PostoRadar**. É o núcleo REST que gerencia **postos** e
**preços** e orquestra os demais serviços do sistema. A validação de
credenciais é delegada ao serviço de autenticação (`postoradar-auth`); a
proximidade, o histórico e as notificações serão integrados aos respectivos
serviços via mensageria.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma ORM
- Validação com Zod

## Arquitetura

```
src/
├── config/        # carregamento e validação das variáveis de ambiente
├── lib/           # prisma client, cliente do serviço de auth, erros http
├── middlewares/   # autenticação (via serviço de auth), erros, wrapper async
├── modules/
│   └── postos/    # rotas, controller, service e validadores de postos/preços
├── app.ts         # composição do Express (middlewares + rotas)
└── server.ts      # bootstrap HTTP e encerramento gracioso
```

### Orquestração da autenticação

A API **não** conhece o segredo do JWT. Em rotas protegidas, o middleware
extrai o `Bearer token` e chama `POST {AUTH_SERVICE_URL}/auth/validate`. Se o
serviço de auth confirmar o token, os dados do usuário ficam disponíveis em
`req.user`. Isso mantém a responsabilidade sobre credenciais isolada no serviço
de autenticação — um requisito típico de sistemas distribuídos.

## Modelo de dados

- **Posto**: `nome`, `bandeira`, `endereco`, `bairro`, `cidade`, `estado` (UF),
  `cep` (opcional), `latitude`, `longitude` e `ativo` (postos desativados saem
  da listagem do mapa sem perder o histórico).
- **Preço**: vinculado a um posto, com `combustivel`, `valor`, `reportadoPor`
  (id do usuário, vindo do auth) e `atualizadoEm`. Mantém-se **um preço corrente
  por (posto, combustível)** — uma nova leitura faz `upsert`. O histórico
  completo é responsabilidade do serviço de histórico.

## Como rodar

Pré-requisitos: Node.js 20+, um PostgreSQL acessível e o serviço
`postoradar-auth` rodando (para as rotas autenticadas).

```bash
npm install
cp .env.example .env       # ajuste DATABASE_URL e AUTH_SERVICE_URL
npm run prisma:migrate
npm run dev
```

A API sobe por padrão em `http://localhost:3333`.

## Endpoints

Base: `/api`

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| GET | `/health` | — | Healthcheck do serviço |
| GET | `/postos` | — | Lista postos (filtro opcional `?cidade=`) |
| GET | `/postos/:id` | — | Detalha um posto com seus preços |
| GET | `/postos/:id/precos` | — | Lista os preços de um posto |
| POST | `/postos` | Bearer | Cadastra um posto |
| PUT | `/postos/:id/precos` | Bearer | Registra/atualiza o preço de um combustível |

Combustíveis aceitos: `GASOLINA_COMUM`, `GASOLINA_ADITIVADA`, `ETANOL`,
`DIESEL`, `DIESEL_S10`, `GNV`.

### Exemplos

**Cadastrar posto** — `POST /api/postos` (com `Authorization: Bearer <token>`)

```json
{
  "nome": "Posto Boa Viagem",
  "bandeira": "Ipiranga",
  "endereco": "Av. Boa Viagem, 1000",
  "bairro": "Boa Viagem",
  "cidade": "Recife",
  "estado": "PE",
  "cep": "51011-000",
  "latitude": -8.12,
  "longitude": -34.9
}
```

**Atualizar preço** — `PUT /api/postos/:id/precos` (com Bearer)

```json
{ "combustivel": "GASOLINA_COMUM", "valor": 5.799 }
```

### Formato de erro

```json
{ "error": { "code": "invalid_token", "message": "Token inválido ou expirado" } }
```

Erros de validação (`422`) trazem `details` com os campos problemáticos. Se o
serviço de auth estiver fora do ar, as rotas protegidas respondem `503`.

## Testando no Postman

A pasta [`postman/`](./postman) traz a coleção `postoradar-api.postman_collection.json`.
Configure a variável `authToken` com um access token obtido no `postoradar-auth`
(ou copie do login lá) para usar as rotas protegidas.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3333` | Porta HTTP |
| `NODE_ENV` | `development` | Ambiente de execução |
| `DATABASE_URL` | — | String de conexão do PostgreSQL |
| `AUTH_SERVICE_URL` | — | Base do serviço de autenticação (ex.: `http://localhost:4000/api`) |
