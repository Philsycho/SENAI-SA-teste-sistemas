//#region Biblioteca: express - APIs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Certifique-se de que o cors está importado aqui
const db = require('./db');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurações de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'true' se estiver usando HTTPS
}));
//#endregion

//#region Biblioteca: multer - upload de arquivos;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        let filename = `${base}${ext}`;
        let counter = 1;
        
        while (fs.existsSync(`uploads/${filename}`)) {
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
//#endregion

//#region Função de Criptografia
function passwordHash(senha) {
    const saltRounds = 10;
    return bcrypt.hashSync(senha, saltRounds);
}
//#endregion

//#region Rotas - POST
app.post('/registro', (req, res) => {
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
    const { nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem } = req.body;
    const document = req.file ? req.file.path : null; // Verifica se o arquivo foi enviado

    const sql = 'INSERT INTO formulario (nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem, document) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem, document], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).json({ erro: 'Erro ao inserir dados' });
            return;
        }
        res.status(201).json({ mensagem: 'Dados inseridos com sucesso!' });
    });
});

app.post('/login', async (req, res) => {
    const { nome_usuario, senha } = req.body;
    const sql = 'SELECT * FROM usuario WHERE nome_usuario = ?';
    db.query(sql, [nome_usuario], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).json({ erro: 'Erro ao buscar usuário' });
            return;
        }
        if (results.length > 0 && await bcrypt.compare(senha, results[0].senha)) {
            req.session.user = results[0];
            res.json({ mensagem: 'Login efetuado com sucesso!' });
        } else {
            res.status(401).json({ erro: 'Nome de usuário ou senha incorretos' });
        }
    });
});
//#endregion

//#region Rotas - GET
app.get('/formularios', (req, res) => {
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

app.get('/registros', (req, res) => {
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
//#endregion

//#region Inicialização do Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
//#endregion
