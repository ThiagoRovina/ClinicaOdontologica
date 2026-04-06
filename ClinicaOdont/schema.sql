CREATE TABLE PACIENTES (
    id_paciente INTEGER PRIMARY KEY,
    nm_paciente VARCHAR(255) NOT NULL,
    dt_nascimento DATE NOT NULL,
    ds_endereco VARCHAR(255),
    nu_telefone VARCHAR(255) NOT NULL,
    ds_email VARCHAR(255) UNIQUE,
    nu_cpf VARCHAR(255) UNIQUE NOT NULL
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
    id_procedimento INTEGER NOT NULL,
    dt_realizacao DATE NOT NULL,
    ds_observacoes VARCHAR(1000),
    FOREIGN KEY (id_paciente) REFERENCES PACIENTES(id_paciente),
    FOREIGN KEY (id_procedimento) REFERENCES PROCEDIMENTOS(id_procedimento)
);