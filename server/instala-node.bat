@echo off
setlocal enabledelayedexpansion

:: Solicita a pasta de instalação
set /p folder="Digite o caminho da pasta onde deseja instalar as bibliotecas: "
cd %folder%

:: Verifica se a pasta existe
if not exist %folder% (
  echo Pasta nao encontrada.
  exit /b
)

:: Cria package.json se não existir
if not exist package.json (
  echo {} > package.json
)

:: Função para instalar uma biblioteca
:install
set "library=%~1"
echo Instalando %library%...
npm install %library% --save
if %errorlevel% neq 0 (
  echo Houve um erro ao instalar %library%. Tentando novamente...
  npm install %library% --save
  if %errorlevel% neq 0 (
    echo Falha ao instalar %library%. Abortando.
    exit /b
  )
)
echo %library% instalado com sucesso.
goto :eof

:: Instala bibliotecas
call :install mysql2
call :install fs
call :install express

echo Todas as bibliotecas foram instaladas com sucesso.
pause
