-- =====================================================
-- Persistema - Inicializacao do Banco de Dados
-- Execute: mysql -u root < backend/sql/init.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS sistema_escolar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_escolar;

-- -----------------------------------------------------
-- Tabela: turmas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS turmas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  serie      VARCHAR(255) NOT NULL,
  ano        VARCHAR(4)    NOT NULL,
  createdAt  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_turmas_nome_serie_ano (nome, serie, ano)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: alunos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS alunos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  data_nascimento DATE         NOT NULL,
  serie           VARCHAR(255) NOT NULL,
  turma_id        INT          NULL,
  cpf             VARCHAR(14)  NULL,
  telefone        VARCHAR(255) NULL,
  endereco        TEXT         NULL,
  createdAt       DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_alunos_email (email),
  UNIQUE KEY uq_alunos_cpf (cpf),
  INDEX idx_alunos_turma_id (turma_id),
  CONSTRAINT fk_alunos_turma
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: notas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS notas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  disciplina VARCHAR(255) NOT NULL,
  bimestre   INT          NOT NULL,
  nota       DECIMAL(4,2) NOT NULL,
  aluno_id   INT          NOT NULL,
  createdAt  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_notas_aluno_disciplina_bimestre (aluno_id, disciplina, bimestre),
  INDEX idx_notas_aluno_id (aluno_id),
  INDEX idx_notas_disciplina (disciplina),
  CONSTRAINT fk_notas_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: frequencias (Missao 005: chamada por aula)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS frequencias (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id         INT          NOT NULL,
  data_aula        DATE         NOT NULL,
  presente         BOOLEAN      NOT NULL DEFAULT FALSE,
  disciplina       VARCHAR(255) NULL,
  turma_id         INT          NULL,
  numero_aula      INT          NOT NULL DEFAULT 1,
  quantidade_aulas INT          NULL,
  plano_aula       VARCHAR(255) NULL,
  createdAt        DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updatedAt        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_frequencias_aluno_data_disc_aula (aluno_id, data_aula, disciplina, numero_aula),
  INDEX idx_frequencias_aluno_id (aluno_id),
  INDEX idx_frequencias_data_aula (data_aula),
  CONSTRAINT fk_frequencias_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: usuarios (Missao 006: login JWT + perfis)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil     ENUM('admin','professor','aluno') NOT NULL DEFAULT 'professor',
  disciplina VARCHAR(255) NULL,
  aluno_id   INT          NULL,
  createdAt  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email),
  UNIQUE KEY uq_usuarios_aluno_id (aluno_id),
  INDEX idx_usuarios_perfil (perfil),
  CONSTRAINT fk_usuarios_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela: auditoria (Missao 007)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT          NULL,
  usuario_nome VARCHAR(255) NULL,
  perfil       VARCHAR(50)  NULL,
  operacao     VARCHAR(100) NOT NULL,
  recurso      VARCHAR(100) NOT NULL,
  recurso_id   VARCHAR(100) NULL,
  detalhes     TEXT         NULL,
  criado_em    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auditoria_criado_em (criado_em),
  INDEX idx_auditoria_operacao (operacao),
  INDEX idx_auditoria_recurso (recurso)
) ENGINE=InnoDB;
