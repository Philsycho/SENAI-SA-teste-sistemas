const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const port = 3000;

// Determinar se está em ambiente de produção ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production';

// Cria o diretório 'uploads' se ele não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Cria o diretório e seus pais, se necessário
}

// Configurar CORS para permitir a origem http://127.0.0.1:5500
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Permitir a origem do frontend
    credentials: true // Permite o envio de cookies
}));

app.use(bodyParser.json());
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: isProduction, // Usar 'true' se estiver em ambiente de produção (HTTPS)
        httpOnly: true, // Assegura que o cookie é transmitido apenas sobre HTTP(S), não acessível via JavaScript
        maxAge: 24 * 60 * 60 * 1000 // Configura o tempo de expiração do cookie (24 horas)
    }
}));

// Middleware de Verificação de Sessão
function verificarSessao(req, res, next) {
    if (req.session.user) {
        console.log(`Usuário ${req.session.user.nome_usuario} está autenticado.`);
        next();
    } else {
        console.log('Usuário não autenticado.');
        res.status(401).json({ erro: 'Usuário não autenticado' });
    }
}

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Usa o diretório 'uploads'
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        let filename = `${base}${ext}`;
        let counter = 1;

        while (fs.existsSync(path.join(uploadsDir, filename))) {
            filename = `${base}(${counter})${ext}`;
            counter++;
        }

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10485760 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos.'), false);
        }
    }
});

// Função de Criptografia
function passwordHash(senha) {
    const saltRounds = 10;
    return bcrypt.hashSync(senha, saltRounds);
}

// Rotas POST
app.post('/registro', (req, res) => {
    console.log('Rota /registro acessada.'); // Log para verificação da rota
    const { nome_completo, nome_usuario, email, senha } = req.body;
    const senhaCriptografada = passwordHash(senha);

    const sql = 'INSERT INTO usuario (nome_completo, nome_usuario, email, senha) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome_completo, nome_usuario, email, senhaCriptografada], (err, results) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).json({ erro: 'Erro ao registrar usuário' });
            return;
        }
        res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
    });
});

app.post('/formulario', upload.single('document'), (req, res) => {
    console.log('Rota /formulario acessada.');
    const { nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem } = req.body;
    const document = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO formulario (nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem, document) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem, document], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ erro: 'Erro ao inserir dados' });
        }
        res.status(201).json({ mensagem: 'Dados inseridos com sucesso!' });
    });
});

// Rota de Login
app.post('/login', async (req, res) => {
    console.log('Rota /login acessada.');
    const { nome_usuario, senha } = req.body;
    
    // Verifica se os campos foram preenchidos
    if (!nome_usuario || !senha) {
        return res.status(400).json({ erro: 'Nome de usuário e senha são obrigatórios' });
    }

    const sql = 'SELECT * FROM usuario WHERE nome_usuario = ?';
    db.query(sql, [nome_usuario], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
        
        // Verifica se o usuário foi encontrado
        if (results.length === 0) {
            return res.status(401).json({ erro: 'Nome de usuário ou senha incorretos' });
        }

        // Compara a senha
        const usuario = results[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (senhaValida) {
            req.session.user = {
                id: usuario.id,
                nome_usuario: usuario.nome_usuario,
                email: usuario.email
            };
            console.log(`Usuário ${nome_usuario} fez login com sucesso.`);
            return res.json({ mensagem: 'Login efetuado com sucesso!' });
        } else {
            console.log(`Tentativa de login falhou para o usuário ${nome_usuario}.`);
            return res.status(401).json({ erro: 'Nome de usuário ou senha incorretos' });
        }
    });
});

// Rotas GET
app.get('/formularios', verificarSessao, (req, res) => {
    console.log('Rota /formularios acessada.'); // Log para verificação da rota
    const sql = 'SELECT * FROM formulario';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao obter Formulários:', err);
            res.status(500).json({ erro: 'Erro ao obter Formulários' });
            return;
        }
        res.json(results);
    });
});

// Rota para verificar a sessão do usuário
app.get('/verificar-sessao', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ mensagem: 'Usuário autenticado', usuario: req.session.user });
    } else {
        res.status(401).json({ erro: 'Usuário não autenticado' });
    }
});

app.get('/registros', verificarSessao, (req, res) => {
    console.log('Rota /registros acessada.'); // Log para verificação da rota
    const sql = 'SELECT * FROM usuario';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao obter Usuários:', err);
            res.status(500).json({ erro: 'Erro ao obter Usuários' });
            return;
        }
        res.json(results);
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).json({ erro: 'Erro ao fazer logout' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ mensagem: 'Logout efetuado com sucesso' });
    });
});

// Rota para servir arquivos PDF
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ erro: 'Arquivo não encontrado' });
    }
});

// Inicialização do Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
