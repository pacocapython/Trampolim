require('dotenv').config();
const express = require('express');
const postgres = require('postgres');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

// Conexão direta com o Supabase usando a DATABASE_URL do seu .env
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Rota de cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const results = await sql`SELECT * FROM cursos`;
        res.json(results);
    } catch (err) {
        console.error("Erro em cursos:", err);
        res.status(500).json({ error: err.message });
    }
});

// Rota de vagas
app.get('/api/vagas', async (req, res) => {
    try {
        const results = await sql`SELECT * FROM vagas`;
        res.json(results);
    } catch (err) {
        console.error("Erro em vagas:", err);
        res.status(500).json({ error: err.message });
    }
});

// Rota de cadastro
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone, cpf, senha, genero, perfil_assistivo } = req.body;

    try {
        await sql`
            INSERT INTO usuarios (nome, email, telefone, cpf, senha, genero, perfil_assistivo) 
            VALUES (${nome}, ${email}, ${telefone}, ${cpf}, ${senha}, ${genero}, ${perfil_assistivo})
        `;

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Candidato registrado com sucesso com todos os dados!" 
        });
    } catch (erro) {
        console.error("Erro ao salvar usuário no PostgreSQL:", erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}! 🚀`);
});