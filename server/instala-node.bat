@echo off
setlocal enabledelayedexpansion

:: Solicita a pasta de instalação
set /p folder="Digite o caminho da pasta onde deseja instalar as bibliotecas: "
cd %folder%

:: Verifica se a pasta existe
if not exist %folder% (
  echo Pasta nao encontrada.
  pause
  exit /b
)

:: Cria package.json se não existir
if not exist package.json (
  echo {} > package.json
)

:: Função para instalar ou atualizar uma biblioteca
:install_or_update
set "library=%~1"
echo Verificando %library%...

:: Obtém a versão instalada
for /f "tokens=*" %%i in ('npm list %library% version --depth=0 2^>nul') do (
  set "installed_version=%%i"
)

:: Obtém a versão disponível
for /f "tokens=*" %%i in ('npm show %library% version') do (
  set "available_version=%%i"
)

:: Compara as versões
if "!installed_version!"=="" (
  echo %library% nao esta instalada. Instalando...
  npm install %library% --save
) else (
  if "!installed_version!"=="!available_version!" (
    echo %library% ja esta na versao mais recente (!installed_version!).
  ) else (
    echo %library% esta na versao !installed_version!. Atualizando para !available_version!...
    npm install %library% --save
  )
)

if %errorlevel% neq 0 (
  echo Houve um erro ao instalar/atualizar %library%. Tentando novamente...
  npm install %library% --save
  if %errorlevel% neq 0 (
    echo Falha ao instalar/atualizar %library%. Abortando.
    pause
    exit /b
  )
)
echo %library% instalado/atualizado com sucesso.
goto :eof

:: Instala ou atualiza bibliotecas
call :install_or_update mysql2
call :install_or_update fs
call :install_or_update express

echo Todas as bibliotecas foram instaladas/atualizadas com sucesso.
pause