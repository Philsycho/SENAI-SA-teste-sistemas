param (
    [string]$InstallDir = ".\minha_pasta"
)

# Cria o diretório se ele não existir
New-Item -ItemType Directory -Force -Path $InstallDir

# Entra no diretório
Set-Location $InstallDir

# Inicializa o projeto npm (se não existir)
if (-Not (Test-Path "package.json")) {
    npm init -y
}

# Instala as dependências do backend
Write-Host "Instalando dependências do backend..."
npm install express body-parser cors express-session bcrypt multer mysql2

# Instala as dependências de automação
Write-Host "Instalando dependências de automação..."
npm install selenium-webdriver chrome

Write-Host "Instalação concluída no diretório $InstallDir!" 