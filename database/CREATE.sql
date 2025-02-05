DROP DATABASE IF EXISTS teste_sistema;
CREATE DATABASE IF NOT EXISTS teste_sistema;
USE teste_sistema;

CREATE TABLE IF NOT EXISTS formulario(
    nome_completo VARCHAR(255)
    ,telefone VARCHAR(20)
    ,email VARCHAR(255)
    ,cpfcnpj VARCHAR(20)
    ,endereco VARCHAR(255)
    ,cep VARCHAR(10)
    ,cidade VARCHAR(255)
    ,estado VARCHAR(255)
    ,data_compra DATE
    ,mensagem VARCHAR(255)
    ,document VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    nome_usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
