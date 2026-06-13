/* =========================================================================
   1. ESTADO INTERNO DO APP
   ========================================================================= */
const estadoApp = {
    usuarioConectado: false,
    tamanhoFonteAmpliado: false,
    fonteDislexiaAtiva: false,
    leitorAudioLigado: false,
    candidaturasEfetuadas: [] // Guarda os IDs das vagas candidatadas
};

/* =========================================================================
   2. BANCO DE DADOS DE VAGAS SIMULADO
   ========================================================================= */
const bancoVagas = [
    {
        id: 'vaga-01',
        cargo: 'Assistente Administrativo Pleno',
        empresa: 'Itaú Unibanco',
        local: 'São Paulo/SP (Híbrido)',
        salario: 'R$ 4.200',
        tags: ['♿ Rampas de Acesso', '🏠 Home Office Híbrido'],
        descricao: 'Atuação na equipa administrativa corporativa. O escritório oferece rampas modernas de acesso de cadeiras de rodas, elevadores amplos com avisos de voz, refeitório acessível e apoio ergonómico.'
    },
    {
        id: 'vaga-02',
        cargo: 'Desenvolvedor Web Júnior',
        empresa: 'Mercado Livre',
        local: '100% Home Office',
        salario: 'R$ 5.800',
        tags: ['🏠 Trabalho Remoto', '🧠 Apoio a Neurodiversidade'],
        descricao: 'Trabalho focado no desenvolvimento de páginas online. Rotina com reuniões diárias curtas de alinhamento por texto, horários de atividade altamente flexíveis e foco no bem-estar cognitivo.'
    },
    {
        id: 'vaga-03',
        cargo: 'Analista de Atendimento ao Cliente',
        empresa: 'Magazine Luiza',
        local: 'Franca/SP (Presencial)',
        salario: 'R$ 3.100',
        tags: ['🤟 Intérprete de Libras', '🧏 Ambiente Adaptado'],
        descricao: 'Responsável pelo suporte especializado a clientes. A empresa disponibiliza intérpretes de Libras corporativos em tempo integral, computadores com softwares de transcrição de voz em tempo real e canais internos de comunicação totalmente acessíveis.'
    },
    {
        id: 'vaga-04',
        cargo: 'Designer Gráfico Assistente',
        empresa: 'Natura',
        local: 'Cajamar/SP (Híbrido)',
        salario: 'R$ 3.900',
        tags: ['👓 Baixa Visão Kit', '🛋️ Estação de Trabalho Adaptada'],
        descricao: 'Criação de peças visuais institucionais. O posto de trabalho conta com ecrãs de alta definição ampliados, teclados de alto contraste com marcações táteis, softwares leitores de ecrã instalados e cadeiras totalmente ajustáveis.'
    }
];

/* =========================================================================
   3. BANCO DE DADOS DE CURSOS SIMULADO
   ========================================================================= */
const bancoCursos = [
    {
        id: 'curso-01',
        titulo: 'Como destacar-se na entrevista inclusiva',
        palestrante: 'Camila Lima (Líder de Talentos)',
        legenda: 'Legenda: "...ao falar com os entrevistadores, explique calmamente as suas rotinas produtivas e os recursos de acessibilidade que melhor apoiam o seu desempenho diário..."',
        concluido: false
    },
    {
        id: 'curso-02',
        titulo: 'Entender a Lei de Cotas',
        palestrante: 'Dr. João Rocha (Advogado do Trabalho)',
        legenda: 'Legenda: "...a legislação protege e garante uma percentagem equilibrada de contratações de profissionais inclusivos em todas as grandes empresas nacionais..."',
        concluido: false
    }
];

/* =========================================================================
   4. SISTEMA DE TRANSIÇÃO DE TELAS
   ========================================================================= */
function mudarParaTela(nomeTela) {
    document.getElementById('tela-login').classList.add('hidden');
    document.getElementById('tela-onboarding').classList.add('hidden');
    document.getElementById('painel-dashboard').classList.add('hidden');

    if (nomeTela === 'login') {
        document.getElementById('tela-login').classList.remove('hidden');
    } else if (nomeTela === 'onboarding') {
        document.getElementById('tela-onboarding').classList.remove('hidden');
    } else if (nomeTela === 'vagas') {
        document.getElementById('painel-dashboard').classList.remove('hidden');
        mudarParaAba('vagas');
    }
}

/* =========================================================================
   5. SISTEMA DE TROCA DE ABAS DO DASHBOARD
   ========================================================================= */
function mudarParaAba(nomeAba) {
    const abas = ['vagas', 'perfil', 'cursos', 'ajustes'];

    abas.forEach(aba => {
        const elementoAba = document.getElementById(`aba-${aba}`);
        const btnLateral = document.getElementById(`btn-lateral-${aba}`);
        const btnMobile = document.getElementById(`btn-mobile-${aba}`);

        if (aba === nomeAba) {
            if (elementoAba) elementoAba.classList.remove('hidden');
            if (btnLateral) btnLateral.classList.add('ativo');
            if (btnMobile) btnMobile.classList.add('ativo');
        } else {
            if (elementoAba) elementoAba.classList.add('hidden');
            if (btnLateral) btnLateral.classList.remove('ativo');
            if (btnMobile) btnMobile.classList.remove('ativo');
        }
    });
}

/* =========================================================================
   6. CONTROLE DE AUTENTICAÇÃO (LOGIN / LOGOUT)
   ========================================================================= */
function fazerLogin(event) {
    if (event) event.preventDefault();
    estadoApp.usuarioConectado = true;
    mudarParaTela('onboarding');
}

function pularLoginParaTestes() {
    estadoApp.usuarioConectado = true;
    mudarParaTela('onboarding');
}

function fazerLogout() {
    estadoApp.usuarioConectado = false;
    mudarParaTela('login');
}

/* =========================================================================
   7. GERADOR DINÂMICO DE VAGAS NO HTML
   ========================================================================= */
function carregarVagas() {
    const container = document.getElementById('container-vagas');
    if (!container) return;
    container.innerHTML = ""; 

    bancoVagas.forEach(vaga => {
        let tagsHTML = "";
        vaga.tags.forEach(tag => {
            tagsHTML += `<span class="card-tag">${tag}</span>`;
        });

        const jaCandidatado = estadoApp.candidaturasEfetuadas.includes(vaga.id);
        const classeBotao = jaCandidatado ? "botao-secundario" : "botao-principal";
        const textoBotao = jaCandidatado ? "Candidatado ✓" : "Candidatar-se";

        const cardHtml = `
            <div class="card-vaga">
                <div class="vaga-conteudo">
                    <span class="vaga-empresa">${vaga.empresa}</span>
                    <h3 class="vaga-titulo">${vaga.cargo}</h3>
                    <p class="vaga-info">📍 ${vaga.local} | Salário: ${vaga.salario}</p>
                    
                    <div>${tagsHTML}</div>

                    <p class="vaga-descricao">
                        ${vaga.descricao}
                    </p>
                </div>

                <div class="vaga-botoes-container">
                    <button onclick="ouvirAudioVaga('${vaga.cargo}', '${vaga.empresa}')" class="botao botao-secundario btn-audio-vaga" title="Ouvir descrição por áudio">🔊</button>
                    <button onclick="enviarInscricao('${vaga.id}')" ${jaCandidatado ? 'disabled' : ''} class="botao ${classeBotao} btn-candidatar-vaga">${textoBotao}</button>
                </div>
            </div>
        `;

        container.innerHTML += cardHtml;
    });
}

/* =========================================================================
   8. GERADOR DINÂMICO DE CURSOS NO HTML
   ========================================================================= */
function carregarCursos() {
    const container = document.getElementById('container-cursos');
    if (!container) return;
    container.innerHTML = "";

    bancoCursos.forEach(curso => {
        const statusTexto = curso.concluido ? "Assistido ✓" : "Não assistido";
        const larguraProgresso = curso.concluido ? "100%" : "30%";

        const cursoHtml = `
            <div class="card-curso">
                <div class="player-video">
                    <div class="video-overlay">
                        <button onclick="assistirVideo('${curso.id}')" class="botao botao-principal btn-play-video">▶</button>
                    </div>

                    <span class="video-palestrante-tag">🎤 ${curso.palestrante}</span>

                    <div class="legenda-video">
                        <p class="video-legenda-texto">${curso.legenda}</p>
                    </div>
                </div>

                <div class="curso-info-container">
                    <h4 class="curso-titulo">${curso.titulo}</h4>
                    
                    <div class="curso-progresso-wrapper">
                        <div class="curso-progresso-textos">
                            <span>Progresso do Utilizador</span>
                            <span>${statusTexto}</span>
                        </div>
                        <div class="curso-barra-fundo">
                            <div class="curso-barra-progresso" style="width: ${larguraProgresso};"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += cursoHtml;
    });
}

/* =========================================================================
   9. INTERAÇÕES E MODAIS (VAGAS, CURSOS E PERFIL)
   ========================================================================= */
function enviarInscricao(idVaga) {
    if (!estadoApp.candidaturasEfetuadas.includes(idVaga)) {
        estadoApp.candidaturasEfetuadas.push(idVaga);
        document.getElementById('modal-sucesso').classList.remove('hidden');
        carregarVagas();
    }
}

function fecharModal() {
    document.getElementById('modal-sucesso').classList.add('hidden');
}

function assistirVideo(idCurso) {
    const curso = bancoCursos.find(c => c.id === idCurso);
    if (curso) {
        curso.concluido = true;
        carregarCursos(); 
        falarMensagemAudio(`Iniciando a aula de: ${curso.titulo}.`);
    }
}

function mostrarNomeDoArquivo() {
    const input = document.getElementById('upload-comprovante');
    const texto = document.getElementById('nome-arquivo-selecionado');
    
    if (input && input.files.length > 0) {
        texto.innerText = "📁 Arquivo selecionado: " + input.files[0].name;
        texto.classList.remove('texto-arquivo-invalido');
        texto.classList.add('texto-arquivo-valido');
    } else if (texto) {
        texto.innerText = "Nenhum arquivo selecionado";
        texto.classList.remove('texto-arquivo-valido');
        texto.classList.add('texto-arquivo-invalido');
    }
}

function salvarPerfil(event) {
    if (event) event.preventDefault();
    mudarParaAba('vagas'); 
    falarMensagemAudio("As suas preferências de acessibilidade foram updated com sucesso!");
}

/* =========================================================================
   10. CONTROLES DE ACESSIBILIDADE VISUAL
   ========================================================================= */
function alternarTamanhoLetra() {
    document.body.classList.toggle('texto-maior');
    const btnTexto = document.getElementById('btn-tamanho-letra');
    if (btnTexto) {
        btnTexto.innerText = document.body.classList.contains('texto-maior') ? "A-" : "A+";
    }
}

function alternarModoLeitura() {
    document.body.classList.toggle('modo-leitura');
    const btnLeitura = document.getElementById('btn-modo-leitura');
    if (btnLeitura) {
        btnLeitura.innerText = document.body.classList.contains('modo-leitura') ? "DESATIVAR MODO LEITURA" : "ATIVAR MODO LEITURA";
    }
}

function alternarDaltonismo() {
    document.body.classList.toggle('modo-daltonismo');
    const btn = document.getElementById('btn-daltonismo');
    if (btn) {
        btn.innerText = document.body.classList.contains('modo-daltonismo') ? "PADRÃO DO SITE" : "OTIMIZAR CORES";
    }
}

/* =========================================================================
   11. RECURSO DE SÍNTESE DE VOZ (ÁUDIO ASSISTIVO)
   ========================================================================= */
function alternarLeitorAudio() {
    estadoApp.leitorAudioLigado = !estadoApp.leitorAudioLigado;
    const botao = document.getElementById('botao-audio');

    if (estadoApp.leitorAudioLigado) {
        if (botao) {
            botao.classList.remove('btn-audio-inativo');
            botao.classList.add('btn-audio-ativo');
        }
        falarTextoAudio("O leitor de apoio está ativado. Clique nos botões de áudio para ler.");
    } else {
        if (botao) {
            botao.classList.remove('btn-audio-ativo');
            botao.classList.add('btn-audio-inativo');
        }
        pararAudio();
    }
}

function falarTextoAudio(textoParaFalar) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); 

    const fala = new SpeechSynthesisUtterance(textoParaFalar);
    fala.lang = 'pt-PT'; 
    fala.rate = 1.1;     

    const banner = document.getElementById('aviso-audio');
    const textoDoBanner = document.getElementById('texto-leitura');
    
    if (banner && textoDoBanner) {
        banner.classList.remove('hidden');
        textoDoBanner.innerText = textoParaFalar.length > 50 ? textoParaFalar.substring(0, 50) + "..." : textoParaFalar;
    }

    fala.onend = function() {
        if (banner) banner.classList.add('hidden');
    };

    window.speechSynthesis.speak(fala);
}

function pararAudio() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    const banner = document.getElementById('aviso-audio');
    if (banner) banner.classList.add('hidden');
}

function falarMensagemAudio(texto) {
    if (estadoApp.leitorAudioLigado) {
        falarTextoAudio(texto);
    }
}

function ouvirAudioVaga(cargo, empresa) {
    falarTextoAudio(`Anúncio da vaga de: ${cargo}, na empresa ${empresa}. Verifique as marcas de suporte físico e remotos no painel.`);
}

/* =========================================================================
   12. EXPORTADOR DE FICHEIROS (RELATÓRIO DE ACESSIBILIDADE)
   ========================================================================= */
function baixarFicheiro(formato) {
    const tituloFicheiro = "relatorio_acessibilidade_trampolim";
    let dadosEscritos = "";
    let tipoDoFicheiro = "text/plain";
    let extensao = "txt";

    const filtroRampa = document.getElementById('filtro-rampa');
    const filtroHome = document.getElementById('filtro-homeoffice');
    const filtroLibras = document.getElementById('filtro-libras');
    const filtroNeuro = document.getElementById('filtro-neurodiversidade');
    const filtroVisual = document.getElementById('filtro-visual');
    const filtroAuditiva = document.getElementById('filtro-auditiva');

    const rampaAtiva = filtroRampa && filtroRampa.checked ? "Necessita: Infraestrutura Física (Rampas/Elevadores)" : null;
    const homeofficeAtiva = filtroHome && filtroHome.checked ? "Necessita: Atividades em Home Office" : null;
    const librasAtiva = filtroLibras && filtroLibras.checked ? "Necessita: Tradução de Linguagem de Sinais (Libras)" : null;
    const neuroAtiva = filtroNeuro && filtroNeuro.checked ? "Necessita: Apoio a Neurodiversidade (Autismo, TDAH, AH/SD)" : null;
    const visualAtiva = filtroVisual && filtroVisual.checked ? "Necessita: Apoio com Deficiência Visual" : null;
    const auditivaAtiva = filtroAuditiva && filtroAuditiva.checked ? "Necessita: Apoio com Deficiência Auditiva" : null;

    const listaRequisitos = [rampaAtiva, homeofficeAtiva, librasAtiva, neuroAtiva, visualAtiva, auditivaAtiva].filter(Boolean);

    if (formato === 'json') {
        const dadosObjeto = {
            origem: "Trampolim Inclusivo Portal",
            data_criacao: new Date().toLocaleDateString('pt-PT'),
            requisitos_acessibilidade: listaRequisitos,
            historico_candidaturas: estadoApp.candidaturasEfetuadas
        };
        dadosEscritos = JSON.stringify(dadosObjeto, null, 2);
        tipoDoFicheiro = "application/json";
        extensao = "json";
    } else {
        dadosEscritos = `
===================================================
RELATÓRIO ASSISTIVO - PORTAL TRAMPOLIM
===================================================
Data de Emissão: ${new Date().toLocaleDateString('pt-PT')}

CONDIÇÕES DE ACESSIBILIDADE SELECIONADAS:
${listaRequisitos.length > 0 ? listaRequisitos.map(req => `- [X] ${req}`).join('\n') : '- Nenhuma preferência ativa selecionada.'}

HISTÓRICO DE CANDIDATURAS (Vagas IDs):
${estadoApp.candidaturasEfetuadas.length > 0 ? estadoApp.candidaturasEfetuadas.join(', ') : 'Nenhuma candidatura realizada.'}
===================================================
        `;
    }

    const arquivoBlob = new Blob([dadosEscritos], { type: tipoDoFicheiro });
    const linkDownload = document.createElement('a');
    linkDownload.href = URL.createObjectURL(arquivoBlob);
    linkDownload.download = `${tituloFicheiro}.${extensao}`;
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
}

/* =========================================================================
   13. LÓGICA DE PASSOS DO TUTORIAL (ONBOARDING)
   ========================================================================= */
function proximoPasso(numeroPasso) {
    for (let i = 1; i <= 3; i++) {
        const passo = document.getElementById('tutorial-passo-' + i);
        const ponto = document.getElementById('ponto-' + i);
        
        if (passo) {
            passo.classList.add('hidden');
            passo.classList.remove('passo-ativo');
        }
        if (ponto) {
            ponto.style.background = ''; // Reseta para respeitar a classe do CSS padrão
        }
    }
    
    const passoAtual = document.getElementById('tutorial-passo-' + numeroPasso);
    const pontoAtual = document.getElementById('ponto-' + numeroPasso);
    
    if (passoAtual) {
        passoAtual.classList.remove('hidden');
        passoAtual.classList.add('passo-ativo');
    }
    if (pontoAtual) {
        pontoAtual.classList.add('ativo'); // Usa a classe .ativo criada no CSS anterior
    }
}

function mudarParaPainel() {
    mudarParaTela('vagas');
}

/* =========================================================================
   14. INICIALIZADOR AUTOMÁTICO DO APP
   ========================================================================= */
carregarVagas();
carregarCursos();
mudarParaTela('login');