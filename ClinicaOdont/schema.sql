CREATE TABLE PACIENTES (
    id_paciente INTEGER PRIMARY KEY,
    nm_paciente VARCHAR(255) NOT NULL,
    dt_nascimento DATE NOT NULL,
    ds_endereco VARCHAR(255),
    nu_telefone VARCHAR(255) NOT NULL,
    ds_email VARCHAR(255) UNIQUE,
    nu_cpf VARCHAR(255) UNIQUE NOT NULL,
    ds_anamnese VARCHAR(2000),
    ds_alergias VARCHAR(500),
    fl_ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE DENTISTAS (
    id_dentista INTEGER PRIMARY KEY,
    nm_dentista VARCHAR(255) NOT NULL,
    ds_especializacao VARCHAR(255) NOT NULL,
    nu_cro VARCHAR(255) UNIQUE NOT NULL,
    ds_email VARCHAR(255) UNIQUE,
    nu_telefone VARCHAR(255)
);

CREATE TABLE CONSULTAS (
    id_consulta INTEGER PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_dentista INTEGER NOT NULL,
    dt_hora_consulta TIMESTAMP NOT NULL,
    ds_status VARCHAR(255) NOT NULL,
    ds_observacoes VARCHAR(255),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_dentista) REFERENCES DENTISTAS(id_dentista)
);

CREATE TABLE USUARIOS (
    id_usuario INTEGER PRIMARY KEY,
    nm_email VARCHAR(255) UNIQUE NOT NULL,
    nm_senha VARCHAR(255) NOT NULL,
    ds_role VARCHAR(255) NOT NULL
);

CREATE TABLE PROCEDIMENTOS (
    id_procedimento INTEGER PRIMARY KEY,
    nm_procedimento VARCHAR(255) NOT NULL,
    ds_procedimento VARCHAR(255),
    vl_procedimento DECIMAL(19,2) NOT NULL
);

CREATE TABLE FUNCIONARIOS (
    id_funcionario INTEGER PRIMARY KEY,
    nm_funcionario VARCHAR(255) NOT NULL,
    nu_matricula INT UNIQUE NOT NULL,
    ds_cargo VARCHAR(255) NOT NULL,
    dt_admissao DATE NOT NULL,
    ds_email VARCHAR(255) UNIQUE NOT NULL,
    nu_telefone VARCHAR(255)
);

CREATE TABLE PRONTUARIOS (
    id_prontuario INTEGER PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    nm_titulo VARCHAR(255),
    id_dentista INTEGER,
    id_procedimento INTEGER,
    dt_realizacao DATE NOT NULL,
    ds_observacoes VARCHAR(1000),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_dentista) REFERENCES DENTISTAS(id_dentista),
    FOREIGN KEY (id_procedimento) REFERENCES PROCEDIMENTOS(id_procedimento)
);

CREATE TABLE LANCAMENTOS_FINANCEIROS (
    id_lancamento VARCHAR(36) PRIMARY KEY,
    tp_lancamento VARCHAR(50) NOT NULL,
    ds_descricao VARCHAR(500) NOT NULL,
    vl_valor DECIMAL(19,2) NOT NULL,
    dt_lancamento DATE NOT NULL,
    ds_status VARCHAR(50) NOT NULL,
    id_paciente INTEGER,
    id_consulta INTEGER,
    ds_observacoes VARCHAR(2000),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_consulta) REFERENCES CONSULTAS(id_consulta)
);
