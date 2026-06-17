require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD, 
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/api/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/vagas', (req, res) => {
    db.query('SELECT * FROM vagas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/cadastro', async (req, res) => {
    // 1. Pegamos TODOS os dados que o front-end está a enviar
    const { nome, email, telefone, cpf, senha, genero, perfil_assistivo } = req.body;

    try {
        // 2. A query agora inclui todos os campos da tabela
        const query = `
            INSERT INTO usuarios (nome, email, telefone, cpf, senha, genero, perfil_assistivo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // 3. Passamos todas as variáveis na ordem certa das interrogações
        await db.query(query, [nome, email, telefone, cpf, senha, genero, perfil_assistivo]);

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Candidato registrado com sucesso com todos os dados!" 
        });
    } catch (erro) {
        console.error("Erro ao salvar usuário no MySQL:", erro);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar os dados no banco." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});