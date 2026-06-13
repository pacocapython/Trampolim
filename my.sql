CREATE DATABASE IF NOT EXISTS trampolim_db;
USE trampolim_db;

-- 1. Criação da Tabela de Vagas
DROP TABLE IF EXISTS vagas;
CREATE TABLE IF NOT EXISTS vagas (
    id VARCHAR(50) PRIMARY KEY,
    cargo VARCHAR(100) NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    local VARCHAR(100) NOT NULL,
    salario VARCHAR(50),
    tags VARCHAR(255), 
    descricao TEXT NOT NULL
);

-- 2. Criação da Tabela de Cursos (Corrigida a vírgula que faltava)
DROP TABLE IF EXISTS cursos;
CREATE TABLE IF NOT EXISTS cursos (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    palestrante TEXT NOT NULL,
    legenda VARCHAR(255),
    concluido VARCHAR(50)
);

-- 3. Inserindo as Vagas Reais (Corrigido os parênteses, as vírgulas e as colunas)
INSERT INTO vagas (id, cargo, empresa, local, salario, tags, descricao) VALUES 
('vaga-01', 'Assistente Administrativo Pleno', 'Itaú Unibanco', 'São Paulo/SP (Híbrido)', 'R$ 4.200', '♿ Rampas de Acesso, 🏠 Home Office Híbrido', 'Atuação na equipa administrativa corporativa. O escritório oferece rampas modernas de acesso de cadeiras de rodas, elevadores amplos com avisos de voz, refeitório acessível e apoio ergonómico.'),
('vaga-02', 'Desenvolvedor Web Júnior', 'Mercado Livre', '100% Home Office', 'R$ 5.800', '🏠 Trabalho Remoto, 🧠 Apoio a Neurodiversidade', 'Trabalho focado no desenvolvimento de páginas online. Rotina com reuniões diárias curtas de alinhamento por texto, horários de atividade altamente flexíveis e foco no bem-estar cognitivo.'),
('vaga-03', 'Analista de Atendimento ao Cliente', 'Magazine Luiza', 'Franca/SP (Presencial)', 'R$ 3.100', '🤟 Intérprete de Libras, 🧏 Ambiente Adaptado', 'Responsável pelo suporte especializado a clientes. A empresa disponibiliza intérpretes de Libras corporativos em tempo integral, computadores com softwares de transcrição de voz em tempo real e canais internos de comunicação totalmente acessíveis.'),
('vaga-04', 'Designer Gráfico Assistente', 'Natura', 'Cajamar/SP (Híbrido)', 'R$ 3.900', '👓 Baixa Visão Kit, 🛋️ Estação de Trabalho Adaptada', 'Criação de peças visuais institucionais. O posto de trabalho conta com ecrãs de alta definição ampliados, teclados de alto contraste com marcações táteis, softwares leitores de ecrã instalados e cadeiras totalmente ajustáveis.');

-- 4. Inserindo os Cursos Reais (Corrigido as aspas e os valores separados)
INSERT INTO cursos (id, titulo, palestrante, legenda, concluido) VALUES 
('curso-01', 'Como destacar-se na entrevista inclusiva', 'Camila Lima (Líder de Talentos)', 'Legenda: "...ao falar com os entrevistadores, explique calmamente as suas rotinas produtivas e os recursos de acessibilidade que melhor apoiam o seu desempenho diário..."', 'false'),
('curso-02', 'Entender a Lei de Cotas', 'Dr. João Rocha (Advogado do Trabalho)', 'Legenda: "...a legislação protege e garante uma percentagem equilibrada de contratações de profissionais inclusivos em todas as grandes empresas nacionais..."', 'false');