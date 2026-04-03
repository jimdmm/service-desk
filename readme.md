# Service Desk API

Sistema de chamados (tickets) de suporte técnico construído com **NestJS**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando o Projeto](#rodando-o-projeto)
- [Testes](#testes)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Fluxo do Ticket](#fluxo-do-ticket)
- [Cache (Redis)](#cache-redis)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Upload de Arquivos](#upload-de-arquivos)

---

## Tecnologias

| Camada           | Tecnologia                          |
| ---------------- | ----------------------------------- |
| Runtime          | Node.js + TypeScript                |
| Framework        | NestJS 11                           |
| Banco de Dados   | PostgreSQL + Prisma 7               |
| Cache            | Redis + ioredis                     |
| Autenticação     | JWT (RS256) + Passport              |
| Validação        | Zod                                 |
| Hash de Senhas   | bcryptjs                            |
| Upload           | Multer (local) / AWS S3 (R2)        |
| Testes           | Vitest + Supertest                  |
| Linter/Formatter | Biome                               |
| Build            | SWC                                 |

---

## Arquitetura

O projeto segue **Clean Architecture** com separação clara entre camadas:

```
src/
├── core/                          # Building blocks (Entity, ValueObject, Either, WatchedList)
├── domain/
│   └── support/
│       ├── enterprise/            # Entidades, Value Objects e Domain Services
│       │   ├── entities/          #   Ticket, Client, Technician, Comment, Attachment
│       │   ├── value-objects/     #   Status, Priority
│       │   └── services/         #   TicketAssignmentService
│       └── application/           # Use Cases, Repositórios (abstratos), DTOs, Erros
│           ├── use-cases/         #   14 casos de uso
│           ├── repositories/      #   Contratos abstratos
│           ├── cryptography/      #   Interfaces (Encrypter, HashComparer, HashGenerator)
│           ├── dto/               #   Tipagem de request/response dos use cases
│           ├── errors/            #   Erros de domínio
│           └── storage/           #   Interface Uploader
└── infra/                         # Implementações concretas
    ├── auth/                      #   JWT Strategy, Guards (Auth + Roles), Decorators
    ├── cache/                     #   RedisCacheService
    ├── cryptography/              #   BcryptHasher, JwtEncrypter
    ├── database/                  #   PrismaService + 6 repositórios Prisma
    ├── env/                       #   EnvService (Zod validation)
    ├── http/                      #   14 Controllers + ZodValidationPipe
    ├── register-user/             #   Módulo isolado de registro
    └── storage/                   #   LocalStorage / R2Storage
```

### Padrões utilizados

- **Either (Left/Right)** — Tratamento de erros sem exceções no domínio
- **Repository Pattern** — Interfaces abstratas no domínio, implementações Prisma na infra
- **Aggregate Root** — Ticket, Client e Technician como raízes de agregado
- **Value Object** — Status e Priority como objetos imutáveis comparados por valor
- **WatchedList** — Rastreia itens adicionados/removidos em coleções (attachments)
- **Domain Service** — `TicketAssignmentService` para lógica que envolve múltiplos agregados

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) e Docker Compose

---

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd service-desk

# Instalar dependências
pnpm install

# Subir PostgreSQL e Redis
docker compose up -d

# Rodar migrações do banco
pnpm prisma migrate deploy
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz baseado no `.env.example`:

```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:docker@localhost:5432/service_desk?schema=public"

# Servidor
PORT=3333

# JWT (RS256) — gerar par de chaves em base64
JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""

# AWS / Cloudflare R2 (para upload remoto)
CLOUDFLARE_ACCOUNT_ID=""
AWS_BUCKET_NAME=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

# Redis (opcionais — valores padrão mostrados)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_DB=0
```

### Gerando chaves JWT (RS256)

```bash
# Gerar chave privada
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Extrair chave pública
openssl rsa -pubout -in private.pem -out public.pem

# Converter para base64 (usar no .env)
cat private.pem | base64 -w 0
cat public.pem | base64 -w 0
```

---

## Rodando o Projeto

```bash
# Desenvolvimento
pnpm start:dev

# Debug
pnpm start:debug

# Produção
pnpm build
pnpm start:prod
```

O servidor inicia na porta definida em `PORT` (padrão: `3333`).

---

## Testes

```bash
# Testes unitários
pnpm test

# Testes unitários (watch mode)
pnpm test:watch

# Testes e2e (requer Docker rodando)
pnpm test:e2e

# Testes e2e (watch mode)
pnpm test:e2e:watch
```

Os testes e2e criam um schema isolado no PostgreSQL para cada arquivo de teste e fazem cleanup automático ao final.

---

## Endpoints da API

### Autenticação

| Método | Rota                         | Auth     | Descrição                       |
| ------ | ---------------------------- | -------- | ------------------------------- |
| POST   | `/users/register`            | Pública  | Registrar novo usuário (Client) |
| POST   | `/sessions`                  | Pública  | Autenticar e receber JWT        |
| PATCH  | `/admin/users/:userId/role`  | `ADMIN`  | Alterar role de um usuário      |

### Tickets

| Método | Rota                                                       | Auth         | Descrição              |
| ------ | ---------------------------------------------------------- | ------------ | ---------------------- |
| POST   | `/tickets`                                                 | Autenticado  | Abrir ticket           |
| PUT    | `/tickets/:ticketId/client/:clientId`                      | `CLIENT`     | Editar ticket          |
| DELETE | `/tickets/:ticketId/client/:clientId`                      | `CLIENT`     | Deletar ticket         |
| PATCH  | `/tickets/:ticketId/close/client/:clientId`                | `CLIENT`     | Fechar ticket          |
| PATCH  | `/tickets/:ticketId/assign/technician/:technicianId`       | `TECHNICIAN` | Atribuir ticket        |
| PATCH  | `/tickets/:ticketId/unassign/technician/:technicianId`     | `TECHNICIAN` | Desatribuir ticket     |
| PATCH  | `/tickets/:ticketId/start/technician/:technicianId`        | `TECHNICIAN` | Iniciar atendimento    |
| PATCH  | `/tickets/:ticketId/resolve/technician/:technicianId`      | `TECHNICIAN` | Resolver ticket        |

### Comentários

| Método | Rota                              | Auth                     | Descrição                           |
| ------ | --------------------------------- | ------------------------ | ----------------------------------- |
| POST   | `/tickets/:ticketId/comments`     | `CLIENT`, `TECHNICIAN`   | Comentar em um ticket               |
| GET    | `/tickets/:ticketId/comments`     | `CLIENT`, `TECHNICIAN`   | Listar comentários (paginado, cache)|

**Query params:** `?page=1` (padrão: 1, 20 itens por página)

### Anexos

| Método | Rota           | Auth                     | Descrição                                      |
| ------ | -------------- | ------------------------ | ---------------------------------------------- |
| POST   | `/attachments` | `CLIENT`, `TECHNICIAN`   | Upload de arquivo (max 2MB, png/jpg/jpeg/pdf)  |

---

## Modelos de Dados

### Client

| Campo      | Tipo     | Descrição        |
| ---------- | -------- | ---------------- |
| id         | UUID     | Identificador    |
| name       | String   | Nome             |
| email      | String   | Email (único)    |
| password   | String   | Senha (hash)     |
| createdAt  | DateTime | Data de criação  |

### Technician

| Campo                | Tipo     | Descrição                        |
| -------------------- | -------- | -------------------------------- |
| id                   | UUID     | Identificador                    |
| name                 | String   | Nome                             |
| email                | String   | Email (único)                    |
| password             | String   | Senha (hash)                     |
| maxConcurrentTickets | Int      | Máximo de tickets simultâneos (3)|
| createdAt            | DateTime | Data de criação                  |

### Ticket

| Campo       | Tipo           | Descrição                                        |
| ----------- | -------------- | ------------------------------------------------ |
| id          | UUID           | Identificador                                    |
| title       | String         | Título                                           |
| description | String         | Descrição do problema                            |
| status      | TicketStatus   | OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED    |
| priority    | TicketPriority | LOW, MEDIUM, HIGH                                |
| openedBy    | UUID (FK)      | Cliente que abriu                                |
| assignedTo  | UUID (FK)      | Técnico atribuído (opcional)                     |
| createdAt   | DateTime       | Data de abertura                                 |
| updatedAt   | DateTime       | Última atualização                               |
| resolvedAt  | DateTime       | Data de resolução (opcional)                     |
| closedAt    | DateTime       | Data de fechamento (opcional)                    |

### Comment

| Campo      | Tipo       | Descrição                    |
| ---------- | ---------- | ---------------------------- |
| id         | UUID       | Identificador                |
| content    | String     | Conteúdo do comentário       |
| authorType | AuthorType | CLIENT ou TECHNICIAN         |
| ticketId   | UUID (FK)  | Ticket relacionado           |
| clientId   | UUID (FK)  | Autor client (opcional)      |
| technicianId | UUID (FK) | Autor technician (opcional) |
| createdAt  | DateTime   | Data de criação              |
| updatedAt  | DateTime   | Última atualização           |

### Attachment

| Campo | Tipo   | Descrição              |
| ----- | ------ | ---------------------- |
| id    | UUID   | Identificador          |
| title | String | Nome do arquivo        |
| link  | String | Caminho/URL do arquivo |

---

## Fluxo do Ticket

O status do ticket segue uma **máquina de estados** com transições válidas:

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │   OPEN ──────► ASSIGNED ──────► IN_PROGRESS  │
  │                  │    ▲           │    │     │
  │                  │    └───────────┘    │     │
  │                  ▼                      ▼    │
  │                OPEN                 RESOLVED │
  │                                         │    │
  │                                         ▼    │
  │                                     CLOSED   │
  │                                              │
  └──────────────────────────────────────────────┘
```

| De            | Para                    | Ação               |
| ------------- | ----------------------- | -------------------|
| OPEN          | ASSIGNED                | Técnico atribui    |
| ASSIGNED      | IN_PROGRESS             | Técnico inicia     |
| ASSIGNED      | OPEN                    | Técnico desatribui |
| IN_PROGRESS   | RESOLVED                | Técnico resolve    |
| IN_PROGRESS   | ASSIGNED                | Técnico desatribui |
| RESOLVED      | CLOSED                  | Cliente fecha      |
| CLOSED        | —                       | Estado terminal    |

### Regras de negócio

- Um técnico só pode ter até `maxConcurrentTickets` (padrão: 3) tickets atribuídos simultaneamente
- Apenas o **cliente que abriu** o ticket pode editá-lo, deletá-lo ou fechá-lo
- Apenas o **técnico atribuído** pode iniciar ou resolver o ticket
- Transições de status inválidas retornam erro

---

## Cache (Redis)

O projeto utiliza **Redis** para cache de consultas, reduzindo a carga no banco de dados.

### Rotas com cache

| Rota                                | Cache Key                         |
| ----------------------------------- | --------------------------------- |
| `GET /tickets/:ticketId/comments`   | `comments:{ticketId}:page:{page}` |

## Autenticação e Autorização

### Fluxo

1. Usuário registra via `POST /users/register` (criado como **CLIENT**)
2. Autentica via `POST /sessions` com email + senha
3. Recebe um **JWT (RS256)** com payload `{ sub: userId, role: CLIENT|TECHNICIAN }`
4. Envia o token no header: `Authorization: Bearer <token>`

### Guards Globais

- **JwtAuthGuard** — Valida JWT em todas as rotas (exceto `@Public()`)
- **RolesGuard** — Verifica o `role` do usuário quando a rota tem `@Roles('TECHNICIAN')`

### Roles

| Role         | Permissões                                                |
| ------------ | --------------------------------------------------------- |
| `CLIENT`     | Abrir, editar, deletar, fechar ticket                     |
| `TECHNICIAN` | Atribuir, desatribuir, iniciar, resolver ticket           |
| `ADMIN`      | Alterar role de usuários                                  |

---

## Upload de Arquivos

- **Rota:** `POST /attachments` (multipart/form-data, campo `file`)
- **Formatos aceitos:** PNG, JPG, JPEG, PDF
- **Tamanho máximo:** 2 MB
- **Storage ativo:** Local (`./uploads/`)
- **Storage alternativo:** Cloudflare R2 (configurável em `StorageModule`)

Os attachments são associados a tickets durante a criação ou edição, usando o `attachmentId` retornado.

---

## Scripts Disponíveis

| Comando             | Descrição                          |
| ------------------- | ---------------------------------- |
| `pnpm start:dev`    | Inicia em modo desenvolvimento     |
| `pnpm start:debug`  | Inicia com debugger                |
| `pnpm build`        | Compila para produção              |
| `pnpm start:prod`   | Inicia versão compilada            |
| `pnpm test`         | Roda testes unitários              |
| `pnpm test:watch`   | Testes unitários em watch          |
| `pnpm test:e2e`     | Roda testes end-to-end             |
| `pnpm test:e2e:watch` | Testes e2e em watch              |
| `pnpm format`       | Formata código com Biome           |
| `pnpm lint`         | Lint do código com Biome           |
