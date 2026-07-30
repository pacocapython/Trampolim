# Trampolim

**Ecossistema de Empregabilidade Inclusiva e Mapeamento de Perfil Assistivo**

* **Aplicação Web (Vercel):** https://trampolim-woad.vercel.app
* **API Backend (Render):** https://trampolim-backend.onrender.com

---

O Trampolim é uma infraestrutura de software desenvolvida para resolver a ineficiência no processo de contratação, integração e retenção de profissionais com deficiência (PcD) no mercado corporativo. A plataforma conecta talentos a oportunidades de trabalho mapeadas segundo critérios técnicos de acessibilidade, reduzindo custos com turnover e garantindo conformidade com políticas de D&I (Diversidade e Inclusão) e metas ESG.

---

## Visão Geral do Produto

O modelo tradicional de recrutamento falha ao ignorar as especificidades de infraestrutura que um profissional com deficiência necessita para exercer suas funções de forma plena. 

O Trampolim atua como uma camada intermediária que automatiza o pareamento entre as necessidades do candidato e a estrutura oferecida pela empresa contratante, otimizando o ciclo de recrutamento e a adaptação do colaborador ao ambiente de trabalho.

### Proposta de Valor B2B

* **Redução do Turnover Inclusivo:** Diminuição na rotatividade de colaboradores PcD através do alinhamento prévio de expectativa e infraestrutura.
* **Conformidade ESG e Lei de Cotas:** Mecanismo estruturado para o cumprimento da Lei nº 8.213/91 com foco em contratações sustentáveis e de longo prazo.
* **Eficiência Operacional em RH:** Padronização da coleta de dados de acessibilidade e redução no tempo médio de preenchimento de vagas especializadas.

---

## Diferenciais Estratégicos

* **Mapeamento de Perfil Assistivo:** Estruturação padronizada dos laudos e necessidades de acessibilidade individuais para aplicação imediata ao ambiente de trabalho.
* **Hub Integrado de Capacitação:** Módulo nativo para qualificação técnica contínua através de trilhas de conhecimento e videoaulas.
* **Acessibilidade Nativa:** Interface projetada sob diretrizes WCAG (Web Content Accessibility Guidelines) para garantir usabilidade universal sem barreiras.
* **Transparência de Infraestrutura:** Módulo de vagas adaptado para demonstrar claramente o suporte oferecido por cada oportunidade (Home Office, Híbrido, Presencial).

---

## Arquitetura Tecnológica

A plataforma foi desenvolvida sob uma arquitetura de microsserviços simples, focando em alta disponibilidade, baixo tempo de resposta e segurança de dados.

| Camada | Tecnologia | Função Estratégica |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Interface responsiva de alta performance hospedada na Vercel Cloud Platform. |
| **Backend** | Node.js, Express.js (REST API) | Camada de integração e gerenciamento das regras de negócio hospedada no Render. |
| **Banco de Dados** | PostgreSQL (Supabase) | Persistência relacional de dados com alta disponibilidade e tolerância a falhas. |
| **Segurança** | Row Level Security (RLS) | Proteção granular no nível de linha do banco de dados para isolamento total de dados sensíveis. |

---

## Arquitetura de Segurança e Conformidade

A plataforma adota a abordagem *Security by Design*, garantindo conformidade com regulamentações de proteção de dados (LGPD):

1. **Isolamento de Dados Sensíveis:** Políticas ativas de RLS no banco de dados garantem que operações públicas no frontend realizem exclusivamente a criação de cadastros (`INSERT`), mantendo os registros protegidos contra consultas ou alterações não autorizadas.
2. **Gestão de Segredos:** Criptografia e isolamento de credenciais de acesso por meio de variáveis de ambiente gerenciadas diretamente na infraestrutura de nuvem.

---

## Instalação e Configuração Local

### Pré-requisitos

* Node.js (versão 18 LTS ou superior)
* Instância PostgreSQL ativa (ou projeto Supabase)

### Passos para Execução

1. Clone o repositório oficial:
   ```bash
   git clone [https://github.com/SEU_USUARIO/Trampolim.git](https://github.com/SEU_USUARIO/Trampolim.git)
