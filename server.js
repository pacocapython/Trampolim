require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
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
    // 1. Desestruture os dados que o 'dadosParaEnviar' do front está disparando
    const { nome, telefone, genero } = req.body;

    try {
        // 2. Monte o INSERT respeitando os campos exatos da sua tabela 'usuarios'
        const query = `
            INSERT INTO usuarios (nome, telefone, genero) 
            VALUES (?, ?, ?)
        `;
        
        // 3. Passe o array de valores na mesma ordem dos pontos de interrogação
        await db.query(query, [nome, telefone, genero]);

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Candidato registrado com sucesso no trampolim_db!" 
        });
    } catch (erro) {
        console.error("Erro ao salvar usuário no MySQL:", erro);
        res.status(500).json({ sucesso: false, erro: "Erro ao conectar com a base de dados." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});