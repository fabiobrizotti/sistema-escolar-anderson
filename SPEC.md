# SPEC - Sistema Escolar

## Visao Geral

Sistema web para gestao escolar. Backend em Express + Sequelize + MySQL. Frontend em React + Material UI.

---

## Arquitetura

### Backend (camadas)

```
Routes -> Controllers -> Services -> Models (Sequelize)
  |           |
  |      Middleware (validate, asyncHandler, errorHandler)
  |
Config (env.js, database.js)
Utils (AppError)
Validators (Zod schemas)
```

- **Routes**: Define endpoints HTTP, aplica validacao e asyncHandler, delega ao controller
- **Controllers**: Apenas orquestracao HTTP (le req, chama service, monta res)
- **Services**: Toda a logica de negocio (regras, validacoes de dominio, queries)
- **Models**: Definicao de tabelas e associacoes (Sequelize)
- **Validators**: Schemas Zod para validacao de entrada
- **Middleware**: Cross-cutting concerns (error handling, validation, rate limiting)
- **Utils**: Utilitarios compartilhados (AppError)

### Frontend (camadas)

```
Routes -> Pages -> Components
  |          |
  |       Hooks (useAlunos, useTurmas, useVincular)
  |
Services (api.js)
Context (AuthContext)
Theme (theme.js)
```

- **Routes**: React Router definindo todas as rotas da aplicacao
- **Pages**: Telas completas (DashboardPage, LoginPage, AlunosPage, TurmasPage)
- **Components**: UI reutilizavel (layout/, common/)
- **Hooks**: Logica de estado e comunicacao com API por modulo
- **Services**: Wrapper centralizado de fetch (api.js)
- **Context**: Gerenciamento de estado global (autenticacao)

---

## Endpoints da API

| Metodo   | Rota                    | Descricao                       |
| -------- | ----------------------- | ------------------------------- |
| `GET`    | `/api/alunos`           | Lista todos os alunos           |
| `POST`   | `/api/alunos`           | Cadastra um aluno               |
| `GET`    | `/api/turmas`           | Lista todas as turmas           |
| `POST`   | `/api/turmas`           | Cadastra uma turma              |
| `GET`    | `/api/turmas/:id/alunos`| Lista alunos de uma turma       |
| `POST`   | `/api/turmas/:id/alunos`| Vincula um aluno a uma turma    |
| `GET`    | `/api/notas`            | Lista todas as notas            |
| `POST`   | `/api/notas`            | Cadastra uma nota               |
| `DELETE` | `/api/notas/:id`        | Exclui uma nota                 |
| `GET`    | `/api/boletim/:alunoId` | Boletim do aluno (medias, etc)  |

### Contratos de Request/Response

**POST /api/alunos**
```json
// Request
{
  "nome": "string (obrigatorio)",
  "email": "string (obrigatorio, unico)",
  "data_nascimento": "YYYY-MM-DD (obrigatorio)",
  "turma_id": "number (opcional, null para sem turma)",
  "serie": "string (obrigatorio se sem turma_id)",
  "cpf": "string (formato 000.000.000-00, opcional)",
  "telefone": "string (opcional)",
  "endereco": "string (opcional)"
}
// Response 201: { id, nome, email, ... }
// Response 400: { erro: "..." }
// Response 409: { erro: "..." }
```

**POST /api/turmas**
```json
// Request
{
  "nome": "string (obrigatorio)",
  "serie": "string (obrigatorio)",
  "ano": "string 4 digitos (obrigatorio)"
}
// Response 201: { id, nome, serie, ano, createdAt, updatedAt }
// Response 409: { erro: "..." }
```

**POST /api/turmas/:id/alunos**
```json
// Request
{ "alunoId": "number (obrigatorio)" }
// Response 200: { id, nome, turma_id, ... }
// Response 404: { erro: "..." }
```

**POST /api/notas**
```json
// Request
{
  "aluno_id": "number (obrigatorio)",
  "disciplina": "string (obrigatorio)",
  "bimestre": "number 1-4 (obrigatorio)",
  "nota": "number 0-10 (obrigatorio)"
}
// Response 201: { id, aluno_id, disciplina, bimestre, nota, ... }
// Response 400: { erro: "..." }
// Response 404: { erro: "..." }
// Response 409: { erro: "..." }
```

**DELETE /api/notas/:id**
```
// Response 204: (sem corpo)
// Response 404: { erro: "..." }
```

**GET /api/boletim/:alunoId**
```json
// Response 200:
{
  "aluno": { "id": 1, "nome": "...", "email": "..." },
  "boletim": [
    {
      "disciplina": "Matematica",
      "notas": [8.0, 7.5],
      "media": 7.75,
      "maiorNota": 8.0,
      "menorNota": 7.5,
      "situacao": "Aprovado"
    }
  ],
  "resumo": {
    "mediaGeral": 7.75,
    "situacaoGeral": "Aprovado",
    "maiorNotaGeral": 8.0,
    "menorNotaGeral": 7.5,
    "totalDisciplinas": 1,
    "totalNotas": 2
  }
}
// Response 404: { erro: "..." }
```

---

## Modelos de Dados

### Aluno (tabela: `alunos`)

| Coluna            | Tipo     | Restricoes           |
| ----------------- | -------- | -------------------- |
| `id`              | INTEGER  | PK, auto-increment   |
| `nome`            | STRING   | NOT NULL             |
| `email`           | STRING   | NOT NULL, UNIQUE     |
| `data_nascimento` | DATEONLY | NOT NULL             |
| `serie`           | STRING   | NOT NULL             |
| `turma_id`        | INTEGER  | NULLABLE, FK->turmas |
| `cpf`             | STRING14 | UNIQUE, NULLABLE     |
| `telefone`        | STRING   | NULLABLE             |
| `endereco`        | TEXT     | NULLABLE             |
| `createdAt`       | DATE     | Auto                 |
| `updatedAt`       | DATE     | Auto                 |

### Turma (tabela: `turmas`)

| Coluna      | Tipo     | Restricoes                   |
| ----------- | -------- | ---------------------------- |
| `id`        | INTEGER  | PK, auto-increment           |
| `nome`      | STRING   | NOT NULL                     |
| `serie`     | STRING   | NOT NULL                     |
| `ano`       | STRING4  | NOT NULL, formato YYYY       |
| `createdAt` | DATE     | Auto                         |
| `updatedAt` | DATE     | Auto                         |

**Indice unico composto**: `(nome, serie, ano)`

### Relacionamento

```
Turma (1) ----------< (N) Aluno
  hasMany               belongsTo
  FK: alunos.turma_id -> turmas.id
  onDelete: SET NULL
  onUpdate: CASCADE
```

### Nota (tabela: `notas`)

| Coluna       | Tipo      | Restricoes                      |
| ------------ | --------- | ------------------------------- |
| `id`         | INTEGER   | PK, auto-increment              |
| `disciplina` | STRING    | NOT NULL                        |
| `bimestre`   | INTEGER   | NOT NULL, 1-4                   |
| `nota`       | DECIMAL4,2| NOT NULL, 0-10                  |
| `aluno_id`   | INTEGER   | NOT NULL, FK->alunos            |
| `createdAt`  | DATE      | Auto                            |
| `updatedAt`  | DATE      | Auto                            |

**Indice unico composto**: `(aluno_id, disciplina, bimestre)`

### Relacionamento

```
Turma (1) ----------< (N) Aluno (1) ----------< (N) Nota
  hasMany               belongsTo   hasMany        belongsTo
  FK: alunos.turma_id    Aluno FK: notas.aluno_id -> alunos.id
  onDelete: SET NULL     onDelete: CASCADE
```

### Logica de Negocio

- Media geral: media de todas as notas do aluno
- Situacao: Aprovado (>=7), Recuperacao (>=5), Reprovado (<5)
- Constraints: Unique constraint impede notas duplicadas para mesma disciplina/bimestre

---

## Estrutura de Pastas

```
backend/
├── .env.example
├── src/
│   ├── config/
│   │   ├── database.js         # Conexao Sequelize
│   │   └── env.js              # Validacao e export de env vars
│   ├── middleware/
│   │   ├── asyncHandler.js     # Wrapper async para controllers
│   │   ├── errorHandler.js     # Middleware centralizado de erros
│   │   └── validate.js         # Validacao Zod para req.body
│   ├── services/
│   │   ├── alunoService.js     # Logica de negocio de Aluno
│   │   ├── turmaService.js     # Logica de negocio de Turma
│   │   └── notaService.js      # Logica de negocio de Nota + Boletim
│   ├── controllers/
│   │   ├── alunoController.js  # HTTP layer - Aluno
│   │   ├── turmaController.js  # HTTP layer - Turma
│   │   └── notaController.js   # HTTP layer - Nota + Boletim
│   ├── models/
│   │   ├── index.js            # Associacoes
│   │   ├── Aluno.js            # Modelo Aluno
│   │   ├── Turma.js            # Modelo Turma
│   │   └── Nota.js             # Modelo Nota
│   ├── validators/
│   │   ├── alunoValidator.js   # Schemas Zod - Aluno
│   │   ├── turmaValidator.js   # Schemas Zod - Turma
│   │   └── notaValidator.js    # Schemas Zod - Nota
│   ├── utils/
│   │   └── AppError.js         # Classe de erro operacional
│   ├── routes/
│   │   ├── index.js            # Monta /api/* + sub-rotas
│   │   ├── alunos/routes.js
│   │   ├── turmas/routes.js
│   │   └── notas/routes.js
│   └── server.js               # Entry point
│
frontend/
├── src/
│   ├── routes/AppRoutes.jsx    # Definicao de rotas
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PlaceholderPage.jsx
│   │   ├── alunos/AlunosPage.jsx
│   │   ├── turmas/TurmasPage.jsx
│   │   └── notas/NotasPage.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx      # Shell com Sidebar + Header + Outlet
│   │   │   ├── Sidebar.jsx     # Menu lateral (responsivo)
│   │   │   └── Header.jsx      # Topo com logout
│   │   └── common/
│   │       ├── AlertMessage.jsx
│   │       ├── EmptyState.jsx
│   │       └── PageHeader.jsx
│   ├── hooks/
│   │   ├── useAlunos.js
│   │   ├── useTurmas.js
│   │   ├── useVincular.js
│   │   └── useNotas.js
│   ├── services/api.js         # Wrapper fetch centralizado
│   ├── context/AuthContext.jsx  # Gerenciamento de auth
│   ├── theme.js                # Tema MUI customizado
│   ├── App.jsx                 # Providers
│   ├── main.jsx                # Entry point
│   └── styles.css
```

---

## Stack Tecnica

### Backend
- Node.js + Express 5
- Sequelize 6 (ORM) + MySQL
- Zod 4 (validacao)
- Helmet (seguranca HTTP)
- express-rate-limit (rate limiting)
- dotenv (variaveis de ambiente)

### Frontend
- React 18
- React Router 7
- Material UI 5 (MUI)
- Vite 5 (build tool)
- Google Fonts (Inter)

---

## Como Rodar

### Backend
```bash
cd backend
cp .env.example .env   # configurar credenciais do banco
npm install
npm run dev             # http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## Missoes Completadas

### Missao 001 - Operacao Secretaria Digital
- Cadastro de alunos (nome, email, data_nascimento, serie)
- Listagem de alunos
- Campos extras: CPF, telefone, endereco
- Formulario responsivo com MUI

### Missao 002 - Operacao Gestao de Turmas
- Cadastro de turmas (nome, serie, ano)
- Vinculo aluno-turma (1:N)
- Listagem de turmas com alunos
- Contador de alunos por turma

---

## Bugs Corrigidos (Refatoracao)

### Backend
- **alunoValidator.js**: `serie` era obrigatoria no validator mas o service a preenche automaticamente a partir de `turma_id`. Agora `serie` e opcional no schema.
- **alunoValidator.js**: `turma_id` com valor string vazia (`""`) era convertido para `0` pelo `z.coerce.number()` e rejeitado por `.positive()`. Corrigido com `z.preprocess` que converte string vazia para `null`.
- **turmaValidator.js**: `ano` recebia valor numerico do frontend (`type="number"`) mas o schema esperava string. Adicionado `z.preprocess` para coercao consistente.
- **AppError duplicado**: A classe `AppError` estava definida separadamente em `alunoService.js` e `turmaService.js`. Extraida para `utils/AppError.js`.
- **alunoService.js**: `cadastrar()` modificava o objeto de entrada diretamente (`dados.serie = turma.serie`). Corrigido para criar copia com spread operator.
- **database.js**: Importava `dotenv/config` diretamente em vez de usar o `env.js` centralizado. Corrigido para usar `env` como unica fonte.
- **server.js**: Funcao `garantirColunaTurmaNosAlunos` era workaround desnecessario. Removida (o sync com associations cria a coluna automaticamente).
- **errorHandler.js**: Verificacao duplicada de `SequelizeUniqueConstraintError` removida (services ja tratam).
- **normalize.js**: Arquivo nao utilizado removido.

### Frontend
- **Layout.jsx**: `CssBaseline` renderizado duplicadamente (ja existe em `main.jsx`). Removido do Layout.
- **Sidebar.jsx**: Botao hamburger duplicado (existia um no Sidebar e outro no Header para mobile). Removido do Sidebar; o Header controla a abertura.
- **Sidebar.jsx**: Navegacao mobile fechava drawer usando CustomEvent. Refatorado para passar `onNavigate` via props.
- **AlunosPage.jsx**: Formulario nao possuia campo `serie` visivel e o turma select era `required`. Corrigido: turma agora e opcional, campo `serie` aparece quando nao ha turma selecionada, e e auto-preenchido quando uma turma e selecionada.
- **database.js**: `DB_PASS` vazia causava `using password: YES` no MySQL do XAMPP. Corrigido com `env.DB_PASS || null` para conectar sem senha quando vazio.

### Visual (Redesign)
- **Tema MUI**: Paleta premium (navy/indigo + gold), sombras refinadas, border-radius 16-20px, gradientes sutis
- **Sidebar**: Fundo gradient navy escuro, indicador lateral gold na rota ativa, avatar do logo, versao do sistema
- **Login**: Tela full-screen gradient escuro com glassmorphism, icone dourado, campos translucidos
- **Dashboard**: Cards com barra de gradiente no topo, hover com elevacao, avatar com cor por modulo
- **Formularios**: Bordas arredondadas 12px, sombras suaves no focus, espacamento generoso
- **Listas**: Avatares com iniciais, chips coloridos por turma, animacao fadeInUp staggered
- **Geral**: Fonte Inter, scrollbar customizada, animacoes de entrada, design responsivo mobile

---

## Proximos Passos

- [ ] Autenticacao real com JWT
- [ ] Cadastro de professores
- [ ] Sistema financeiro (mensalidades)
- [ ] Relatorios
- [ ] Testes automatizados (Jest + Supertest no backend, Vitest no frontend)
- [ ] Migrations do Sequelize (substituir sync force)
- [ ] Paginacao e busca nos endpoints de listagem
- [ ] Tratamento de erros de rede no frontend (toast de retry)
