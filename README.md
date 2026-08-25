# Persistema - Sistema de Gestao Escolar

Sistema completo para gestao escolar com backend em Node.js + Express e frontend em React.

## Funcionalidades

- Cadastro de alunos
- Gestao de turmas (vinculo turma-aluno)
- Lancamento de notas e boletim do aluno
- Controle de frequencia com estatisticas e ranking

## Pre-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [XAMPP](https://www.apachefriends.org/) (ou qualquer servidor MySQL rodando na porta 3306)
- Git

## Instalacao

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd software-house-anderson
```

### 2. Instalar dependencias do backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias do frontend

```bash
cd ../frontend
npm install
```

### 4. Criar o banco de dados

Inicie o XAMPP (Apache + MySQL), depois abra o terminal e rode:

```bash
mysql -u root < backend/sql/init.sql
```

Isso cria o banco `sistema_escolar` com todas as tabelas (turmas, alunos, notas, frequencias).

### 5. Configurar o arquivo .env

O arquivo `backend/.env` ja vem configurado para XAMPP local:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
DB_NAME=sistema_escolar
DB_USER=root
DB_PASS=
```

Se voce usa senha no MySQL, preencha `DB_PASS`.

## Iniciar o Sistema

Abra **dois terminais**:

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

O servidor inicia em `http://localhost:3000`.

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

O frontend inicia em `http://localhost:5173` e redireciona automaticamente para o backend.

## Acessar o Sistema

1. Acesse `http://localhost:5173` no navegador
2. Faca login com **qualquer usuario e senha** (autenticacao fake)
3. Navegue pelo menu lateral

## Arquitetura

```
backend/
├── sql/init.sql              # Script de criacao do banco
├── src/
│   ├── config/               # Database e variaveis de ambiente
│   ├── middleware/            # asyncHandler, errorHandler, validate (Zod)
│   ├── models/               # Sequelize: Aluno, Turma, Nota, Frequencia
│   ├── controllers/          # Camada HTTP de cada modulo
│   ├── services/             # Logica de negocio de cada modulo
│   ├── validators/           # Schemas Zod de cada modulo
│   └── routes/               # Rotas de cada modulo

frontend/
├── src/
│   ├── pages/                # Paginas: Login, Dashboard, Alunos, Turmas, Notas, Frequencia
│   ├── components/           # Layout (Sidebar, Header) e componentes comuns
│   ├── hooks/                # Hooks customizados: useAlunos, useTurmas, useNotas, useFrequencias
│   ├── context/              # AuthContext (autenticacao fake)
│   ├── routes/               # AppRoutes (definicao de rotas)
│   ├── services/api.js       # Cliente HTTP (fetch wrapper)
│   └── theme.js              # Tema MUI + paleta de cores
```

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/alunos` | Lista alunos |
| POST | `/api/alunos` | Cadastra aluno |
| GET | `/api/turmas` | Lista turmas |
| POST | `/api/turmas` | Cadastra turma |
| POST | `/api/turmas/:id/alunos` | Vincula aluno a turma |
| GET | `/api/notas` | Lista notas |
| POST | `/api/notas` | Cadastra nota |
| DELETE | `/api/notas/:id` | Exclui nota |
| GET | `/api/boletim/:alunoId` | Boletim do aluno |
| GET | `/api/frequencias` | Lista frequencias |
| POST | `/api/frequencias` | Registra frequencia |
| DELETE | `/api/frequencias/:id` | Exclui registro |
| GET | `/api/frequencias/stats/:alunoId` | Estatisticas do aluno |
| GET | `/api/frequencias/ranking/:turmaId` | Ranking da turma |
| GET | `/api/frequencias/risco` | Alunos abaixo de 75% |

## Comandos Uteis

```bash
# Backend
cd backend
npm run dev        # Iniciar com nodemon (hot reload)
npm start          # Iniciar em producao

# Frontend
cd frontend
npm run dev        # Iniciar servidor de desenvolvimento
npm run build      # Gerar build de producao
```

## Tecnologias

**Backend:** Express 5, Sequelize 6, MySQL, Zod, Helmet, CORS

**Frontend:** React 18, MUI 5, React Router 7, Vite 5
