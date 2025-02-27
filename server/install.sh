#!/bin/bash

# Verifica se o diretório foi passado como argumento
if [ -z "$1" ]; then
    echo "Uso: $0 <diretório>"
    exit 1
fi

# Define o diretório de instalação
INSTALL_DIR=$1

# Cria o diretório se ele não existir
mkdir -p $INSTALL_DIR

# Entra no diretório
cd $INSTALL_DIR

# Inicializa o projeto npm (se não existir)
if [ ! -f "package.json" ]; then
    npm init -y
fi

# Instala as dependências do backend
echo "Instalando dependências do backend..."
npm install express body-parser cors express-session bcrypt multer mysql2

# Instala as dependências de automação
echo "Instalando dependências de automação..."
npm install selenium-webdriver chrome

echo "Instalação concluída no diretório $INSTALL_DIR!"