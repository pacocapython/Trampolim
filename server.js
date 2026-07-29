require('dotenv').config();
const express = require('express');
const postgres = require('postgres');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

// Conexão com o Supabase via Pooler (porta 6543)
const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require',
  prepare: false 
});

// Rota de Vagas
app.get('/api/vagas', async (req, res) => {
  try {
    const vagas = await sql`SELECT * FROM vagas`;
    res.json(vagas);
  } catch (error) {
    console.error('Erro na rota de vagas:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// Rota de Cursos
app.get('/api/cursos', async (req, res) => {
  try {
    const cursos = await sql`SELECT * FROM cursos`;
    res.json(cursos);
  } catch (error) {
    console.error('Erro na rota de cursos:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// Rota de Cadastro de Candidatos (Corrigida sem conflito de UNIQUE)
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone, cpf, senha, genero, perfil_assistivo } = req.body;

    // Converte campos vazios em null para o Postgres aceitar sem erro de chave duplicada (UNIQUE)
    const emailValor = email && email.trim() !== '' ? email : null;
    const cpfValor = cpf && cpf.trim() !== '' ? cpf : null;
    const telefoneValor = telefone && telefone.trim() !== '' ? telefone : 'Nao informado';
    const generoValor = genero && genero.trim() !== '' ? genero : 'Nao informado';
    const perfilValor = perfil_assistivo && perfil_assistivo.trim() !== '' ? perfil_assistivo : null;

    try {
        await sql`
            INSERT INTO usuarios (
                nome, 
                email, 
                telefone, 
                cpf, 
                senha, 
                genero, 
                perfil_assistivo
            ) 
            VALUES (
                ${nome}, 
                ${emailValor}, 
                ${telefoneValor}, 
                ${cpfValor}, 
                ${senha}, 
                ${generoValor}, 
                ${perfilValor}
            )
        `;

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Candidato registrado com sucesso com todos os dados!" 
        });
    } catch (erro) {
        console.error("Erro ao salvar usuário no PostgreSQL:", erro.message);

        // Se for erro de e-mail ou CPF que já existem no banco
        if (erro.code === '23505') {
            return res.status(400).json({ 
                sucesso: false, 
                erro: "Este e-mail ou CPF já está cadastrado." 
            });
        }

        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}! 🚀`);
});