# Persistema — Sistema de Gestão Escolar

Trabalho escolar: sistema web para cadastro de alunos, turmas, notas, frequência com chamada por aula, login com perfis (admin/professor/aluno), auditoria e portal do aluno.

**Stack:** Node.js + Express + Sequelize + MySQL 8 (backend), React + MUI + Vite (frontend), tudo orquestrado via Docker Compose. Banco visualizável pelo Adminer.

---

## 1. Como rodar (modo Docker — recomendado)

Pré-requisitos: Docker + Docker Compose.

```bash
cd sistema-escolar-anderson
sudo docker compose up --build
```

Na primeira vez o build baixa as imagens (MySQL 8, Node 20) e pode levar alguns minutos. Nas próximas, basta `sudo docker compose up`.

| Serviço | URL | O que é |
|---|---|---|
| Frontend (sistema) | http://localhost:5173 | Tela do sistema — login e todos os módulos |
| Backend (API) | http://localhost:3000/api | API REST (JSON) |
| Adminer (banco) | http://localhost:8080 | Visualizar tabelas e dados do MySQL no navegador |
| MySQL | localhost:3306 | Banco `sistema_escolar` (user `escola` / senha `escola123`) |

Para parar: `Ctrl+C`. Para derrubar e apagar o banco: `sudo docker compose down -v`. Logs por serviço: `sudo docker compose logs -f backend` (ou `db`, `frontend`).

### Login no Adminer
Sistema: `MySQL` · Servidor: `db` · Usuário: `escola` · Senha: `escola123` · Base: `sistema_escolar`

## 2. Como rodar sem Docker (alternativo)

Pré-requisitos: Node.js 18+ e MySQL rodando na porta 3306.

```bash
# 1. Banco
mysql -u root < backend/sql/init.sql

# 2. Backend
cd backend
cp -n .env.example .env
npm install
npm run dev   # http://localhost:3000

# 3. Frontend (outro terminal)
cd frontend
npm install
npm run dev   # http://localhost:5173
```

Variáveis do `backend/.env` (valores padrão já funcionam com XAMPP local): `PORT=3000`, `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME=sistema_escolar`, `DB_USER=root`, `DB_PASS=` (vazio), `JWT_SECRET`, `SEED_ADMIN_EMAIL=admin@escola.com`, `SEED_ADMIN_SENHA=admin123`.

## 3. Logins e perfis

Na primeira subida o sistema cria o admin automaticamente. Professores e alunos são criados pelo admin na tela **Usuários**.

| Perfil | Login | Senha | Acesso |
|---|---|---|---|
| Admin | `admin@escola.com` | `admin123` | Tudo: alunos, turmas, notas, frequência, chamada, auditoria, usuários |
| Professor | criado pelo admin (ex: `maria@escola.com`) | definida pelo admin | Alunos, turmas, notas, frequência e **chamada só da própria disciplina** |
| Aluno | criado pelo admin (vinculado ao cadastro do aluno) | definida pelo admin | Só o **Meu Portal**: próprias notas e frequência |

Autenticação real com JWT (token expira em 8h) + senha com hash bcrypt. Sem token, a API responde 401; perfil errado responde 403.

## 4. Roteiro de demonstração (5 min)

1. Entre em http://localhost:5173 como admin (`admin@escola.com` / `admin123`).
2. **Turmas** → crie ex: `1º DS`, série `1º ano`, ano `2026`.
3. **Alunos** → cadastre 2 alunos na turma.
4. **Usuários** → crie 1 professor com disciplina (ex: `Matematica`) e 1 aluno vinculado a um dos cadastros.
5. **Fazer Chamada** → selecione turma, disciplina, data, qtd. de aulas (ex: 2) e plano de aula → marque faltas nos checkboxes (1 por aula) → Salvar.
6. **Notas** → lance notas (disciplina, bimestre, nota) e veja o boletim com médias e situação (Aprovado/Recuperação/Reprovado).
7. **Frequência** → veja % por aluno, classificação (Boa/Atenção/Risco < 75%) e ranking da turma.
8. **Auditoria** → confira os eventos (`LOGIN_OK`, `ALUNO_CRIADO`, `CHAMADA_SALVA`, `NOTA_CRIADA`...) com busca e filtros. Tente login errado e veja o `LOGIN_FALHA`.
9. Saia e entre como aluno → **Meu Portal**: só as próprias notas e frequência.
10. No Adminer (http://localhost:8080), abra as tabelas `alunos`, `notas`, `frequencias`, `usuarios`, `auditoria` e mostre os registros criados.

## 5. Módulos e missões

| Missão | Tema | Status | Onde ver |
|---|---|---|---|
| 001 | Cadastro de alunos (com CPF, telefone, endereço) | Pronta | Alunos |
| 002 | Turmas + vínculo aluno↔turma + contador | Pronta | Turmas |
| 003 | Notas + boletim (médias, maior/menor, situação) | Pronta | Notas |
| 004 | Frequência (% + risco < 75% + ranking) | Pronta | Frequência |
| 005 | Chamada por aula do professor (checkbox de falta por aula) | Pronta | Fazer Chamada |
| 006 | Login JWT + perfis + senhas com hash | Pronta | Login, Usuários |
| 007 | Auditoria (quem fez o quê e quando, só admin) | Pronta | Auditoria |
| 008 | Portal do aluno (só os próprios dados) | Pronta | Meu Portal (perfil aluno) |

## 6. API (principais endpoints)

Todos (exceto login) exigem `Authorization: Bearer <token>`.

| Método | Rota | Quem | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | público | Login, retorna `{ token, usuario }` |
| GET/POST | `/api/alunos` | admin, professor (criar: só admin) | Lista/cadastra alunos |
| GET/POST | `/api/turmas` | admin, professor (criar: só admin) | Lista/cadastra turmas |
| POST | `/api/turmas/:id/alunos` | admin | Vincula aluno à turma |
| GET/POST/DELETE | `/api/notas` | admin, professor | Notas |
| GET | `/api/boletim/:alunoId` | admin, professor, aluno (só o próprio) | Boletim com médias |
| GET/POST/DELETE | `/api/frequencias` | admin, professor | Frequência |
| POST | `/api/frequencias/chamada` | admin, professor | Chamada por aula (faltas por aula) |
| GET | `/api/frequencias/stats/:alunoId`, `/ranking/:turmaId`, `/risco` | admin, professor (+aluno no stats próprio) | Estatísticas |
| GET | `/api/auditoria`, `/api/auditoria/resumo` | admin | Eventos + indicadores |
| GET/POST | `/api/usuarios` | admin | Contas |
| GET | `/api/aluno/notas`, `/api/aluno/frequencia`, `/api/aluno/frequencia/resumo` | aluno | Portal (só dados próprios) |

## 7. Estrutura do projeto

```
docker-compose.yml        # db (MySQL 8) + backend + frontend + adminer
backend/
├── Dockerfile
├── sql/init.sql          # criação do banco + tabelas (usuarios, auditoria, chamada por aula)
├── .env.example          # variáveis (copie para .env no modo sem Docker)
└── src/
    ├── config/           # env, database
    ├── middleware/       # asyncHandler, errorHandler, validate (Zod), auth (JWT)
    ├── models/           # Aluno, Turma, Nota, Frequencia, Usuario, Auditoria
    ├── controllers/      # camada HTTP
    ├── services/         # regras de negócio + registro de auditoria
    ├── validators/       # schemas Zod
    ├── routes/           # auth, alunos, turmas, notas, frequencias, auditoria, usuarios, aluno (portal)
    └── seed.js           # cria o admin inicial
frontend/
├── Dockerfile
└── src/
    ├── pages/            # Login, Dashboard, Alunos, Turmas, Notas, Frequencia, Chamada, Auditoria, Usuarios, Portal (aluno)
    ├── components/       # layout (Sidebar/Header), common
    ├── hooks/            # useAlunos, useTurmas, useNotas, useFrequencias...
    ├── context/          # AuthContext (login JWT, usuário logado)
    ├── routes/           # AppRoutes (rotas por perfil)
    └── services/api.js   # fetch com Bearer automático
MISSOES/                  # enunciados das 8 missões
