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
-- Tabela: frequencias
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS frequencias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id  INT      NOT NULL,
  data_aula DATE     NOT NULL,
  presente  BOOLEAN  NOT NULL DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_frequencias_aluno_data (aluno_id, data_aula),
  INDEX idx_frequencias_aluno_id (aluno_id),
  INDEX idx_frequencias_data_aula (data_aula),
  CONSTRAINT fk_frequencias_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
