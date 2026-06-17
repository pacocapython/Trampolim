require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // 1. Mudança aqui: Importação com Promises
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

// 2. Mudança aqui: Rota cursos atualizada para async/await
app.get('/api/cursos', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM cursos');
        res.json(results);
    } catch (err) {
        console.error("Erro em cursos:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Mudança aqui: Rota vagas atualizada para async/await
app.get('/api/vagas', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM vagas');
        res.json(results);
    } catch (err) {
        console.error("Erro em vagas:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Mudança aqui: Rota cadastro completa salvando todos os campos
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone, cpf, senha, genero, perfil_assistivo } = req.body;

    try {
        const query = `
            INSERT INTO usuarios (nome, email, telefone, cpf, senha, genero, perfil_assistivo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [nome, email, telefone, cpf, senha, genero, perfil_assistivo]);

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Candidato registrado com sucesso com todos os dados!" 
        });
    } catch (erro) {
        console.error("Erro ao salvar usuário no MySQL:", erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});