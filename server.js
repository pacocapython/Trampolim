require('dotenv').config(); // 👈 ESSA LINHA PRECISA SER A PRIMEIRA DO ARQUIVO
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexão Inteligente: Usa o Railway em produção ou o XAMPP no seu PC
// 🔌 Conexão Inteligente e Estável com Pool
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

// Nota: O Pool não precisa do comando "db.connect()", ele conecta sozinho quando recebe requisições!

// 🛣️ Rota para buscar os cursos
app.get('/api/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🛣️ Rota para buscar as vagas
app.get('/api/vagas', (req, res) => {
    db.query('SELECT * FROM vagas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🚀 Porta dinâmica para o Railway funcionar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});