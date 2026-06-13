const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Vamos usar isto para o script.js conseguir conversar com o server sem bloqueios

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexão com o teu banco de dados do XAMPP
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'trampolim_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Boa! Servidor conectado ao MySQL com sucesso.');
});

// 🛣️ Rota para o teu script.js buscar os cursos do banco
app.get('/api/cursos', (req, res) => {
    const query = 'SELECT * FROM cursos';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Envia os dados no formato que o JS entende
    });
});
// Verifique se essa rota existe no seu server.js
app.get('/api/vagas', (req, res) => {
    // Mude 'vagas' para o nome exato da tabela de vagas que está no seu banco de dados
    const query = 'SELECT * FROM vagas'; 
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Envia as vagas do banco para o seu script.js
    });
});
// 🚀 ISSO DAQUI ESTAVA FALTANDO! Liga o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando com sucesso na porta 3000!');
});