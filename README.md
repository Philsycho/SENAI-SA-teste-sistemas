# Sistema de Formulários com Autenticação

Este projeto é um sistema completo para envio e visualização de formulários, com autenticação de usuários e upload de arquivos PDF.

## Requisitos

- **Node.js** (v14 ou superior)
- **MySQL** (v5.7 ou superior)
- **NPM** (v6 ou superior)
- **Google Chrome** (para automação com Selenium)

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Philsycho/SENAI-SA-teste-sistemas
   cd SENAI-SA-teste-sistemas
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o banco de dados**:
   - Crie um banco de dados MySQL chamado `teste_sistema`.
   - Execute o script SQL em `database/CREATE.sql` para criar as tabelas necessárias.

4. **Configure o arquivo `.env`**:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=teste_sistema
   SESSION_SECRET=seuSegredoAqui
   ```

5. **Inicie o servidor**:
   ```bash
   node server/api.js
   ```

6. **Acesse o frontend**:
   Abra o arquivo `public/login.html` no seu navegador.

## Estrutura do Projeto

- **server/api.js**: Servidor Node.js com as rotas da API.
- **public/**: Páginas HTML e CSS do frontend.
- **database/CREATE.sql**: Script SQL para criar as tabelas no banco de dados.
- **server/automacao.js**: Script de automação para preenchimento de formulários.

## Rotas da API

- **POST /registro**: Registra um novo usuário.
- **POST /login**: Autentica um usuário.
- **POST /formulario**: Envia um formulário com upload de arquivo PDF.
- **GET /formularios**: Retorna todos os formulários enviados (requer autenticação).
- **GET /verificar-sessao**: Verifica se o usuário está autenticado.
- **POST /logout**: Encerra a sessão do usuário.
- **GET /uploads/:filename**: Serve arquivos PDF armazenados no servidor.

## Frontend

- **login.html**: Página de login.
- **registro.html**: Página de registro de usuário.
- **formulario.html**: Página para envio de formulários.
- **visualizar.html**: Página para visualizar os formulários enviados.

## Dependências

- **express**: Framework para criar o servidor.
- **body-parser**: Para processar dados do corpo das requisições.
- **cors**: Para permitir requisições de diferentes origens.
- **express-session**: Para gerenciar sessões de usuários.
- **bcrypt**: Para criptografar senhas.
- **multer**: Para lidar com upload de arquivos.
- **mysql2**: Para conectar ao banco de dados MySQL.
- **selenium-webdriver**: Para automação de testes no navegador.
- **chrome**: Driver do Chrome para o Selenium.

## Executando o Projeto

1. **Inicie o servidor**:
   ```bash
   node server/api.js
   ```

2. **Acesse o frontend**:
   Abra o arquivo `public/login.html` no seu navegador.

3. **Automação**:
   Para executar o script de automação, use:
   ```bash
   node server/automacao.js
   ```
   Certifique-se de que há arquivos PDF na pasta `pdfs-teste` para que o script possa selecionar e enviar aleatoriamente.

4. **Pasta de PDFs**:
   Crie uma pasta chamada `pdfs-teste` no mesmo diretório onde o script `automacao.js` está localizado e coloque alguns arquivos PDF lá.

5. **Detalhes da Automação**:
   - O script preenche automaticamente os campos do formulário.
   - Seleciona aleatoriamente um arquivo PDF da pasta `pdfs-teste` para upload.
   - Fecha automaticamente o alerta de sucesso após o envio do formulário.
   - Gera um relatório em TXT com os detalhes de cada preenchimento.

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Problemas Comuns

- **Erro ao conectar ao servidor**: Certifique-se de que o servidor está rodando e que o frontend está acessando a URL correta.
- **Erro ao enviar formulário**: Verifique se todos os campos obrigatórios foram preenchidos e se o arquivo PDF não excede o limite de 10MB.
- **Erro ao visualizar documento**: Certifique-se de que o arquivo PDF foi salvo corretamente no diretório `uploads` e que o caminho no banco de dados está correto.
- **Erro na automação**: Verifique se a pasta `pdfs-teste` existe e contém arquivos PDF.

## Suporte

Para suporte, entre em contato com [seu-email@dominio.com](mailto:seu-email@dominio.com).