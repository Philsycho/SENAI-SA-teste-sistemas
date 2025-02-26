# Sistema de Formulários com Autenticação

Este projeto é um sistema completo para envio e visualização de formulários, com autenticação de usuários e upload de arquivos PDF.

## Requisitos

- Node.js (v14 ou superior)
- MySQL
- NPM (v6 ou superior)

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências**:
   ```bash
   npm install express body-parser cors express-session bcrypt multer mysql2
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

## Rotas da API

- **POST /registro**: Registra um novo usuário.
- **POST /login**: Autentica um usuário.
- **POST /formulario**: Envia um formulário com upload de arquivo PDF.
- **GET /formularios**: Retorna todos os formulários enviados (requer autenticação).
- **GET /verificar-sessao**: Verifica se o usuário está autenticado.
- **POST /logout**: Encerra a sessão do usuário.

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

## Executando o Projeto

1. **Inicie o servidor**:
   ```bash
   node server/api.js
   ```

2. **Acesse o frontend**:
   Abra o arquivo `public/login.html` no seu navegador.

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.