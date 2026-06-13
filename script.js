/* =========================================================================
   1. ESTADO INTERNO DO APP E CONEXÃO COM O BANCO DE DADOS
   ========================================================================= */
const estadoApp = {
    usuarioConectado: false,
    tamanhoFonteAmpliado: false,
    fonteDislexiaAtiva: false,
    leitorAudioLigado: false,
    candidaturasEfetuadas: [] 
};

// 🔄 Busca os cursos reais lá no MySQL
async function carregarCursosDoBanco() {
    try {
        const resposta = await fetch('http://localhost:3000/api/cursos');
        const cursosDoMySQL = await resposta.json();
        
        console.log("Cursos vindos do MySQL:", cursosDoMySQL);

        // Desenha na tela passando a lista que veio direto do MySQL
        carregarCursos(cursosDoMySQL); 

    } catch (erro) {
        console.error("Erro ao puxar os cursos do servidor:", erro);
    }
}

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

    // 🚀 AS DUAS LINHAS MÁGICAS QUE ESTAVAM FALTANDO AQUI:
    if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
    if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();

    mudarParaTela('onboarding');
}

function pularLoginParaTestes() {
    estadoApp.usuarioConectado = true;

    // Colocamos aqui também para garantir se entrar como convidado
    if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
    if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();

    mudarParaTela('onboarding');
}

function fazerLogout() {
    estadoApp.usuarioConectado = false;
    mudarParaTela('login');
}

/* =========================================================================
   7. GERADOR DINÂMICO DE VAGAS NO HTML (CORRIGIDO ERRO DE VARIÁVEL)
   ========================================================================= */
function carregarVagas(listaDeVagas) {
    const container = document.getElementById('container-vagas');
    if (!container) return;
    container.innerHTML = "";   

    if (!listaDeVagas || listaDeVagas.length === 0) {
        container.innerHTML = `<p style="color: white; padding: 20px;">Nenhuma vaga encontrada no banco de dados ou rota /api/vagas não configurada no servidor.</p>`;
        return;
    }

    listaDeVagas.forEach(vaga => {
        let tagsHTML = "";
        
        // Trata as tags caso venham como string separada por vírgula do banco
        const tags = Array.isArray(vaga.tags) ? vaga.tags : (vaga.tags ? vaga.tags.split(',') : []);
        tags.forEach(tag => {
            if(tag.trim()) {
                tagsHTML += `<span class="card-tag">${tag.trim()}</span>`;
            }
        });

        const jaCandidatado = estadoApp.candidaturasEfetuadas.includes(vaga.id);
        const classeBotao = jaCandidatado ? "botao-secundario" : "botao-principal";
        const textoBotao = jaCandidatado ? "Candidatado ✓" : "Candidatar-se";

        // Mapeamento idêntico ao das colunas criadas na sua tabela do MySQL
        const idVaga = vaga.id || "Não informado";
        const cargoVaga = vaga.cargo || "Vaga Sem Título";
        const empresaVaga = vaga.empresa || "Empresa Não Informada";
        const localVaga = vaga.local || "Não especificado";
        const salarioVaga = vaga.salario || "Não informado";
        const descricaoVaga = vaga.descricao || "Sem descrição disponível.";

        // CORRIGIDO: Agora usa cargoVaga e empresaVaga certinho sem quebrar o JavaScript
        const cardHtml = `
            <div class="card-vaga">
                <div class="vaga-conteudo">
                    <span class="vaga-empresa">${empresaVaga}</span>
                    <h3 class="vaga-titulo">${cargoVaga}</h3>
                    <p class="vaga-info">📍 ${localVaga} | Salário: ${salarioVaga}</p>
                    
                    <div>${tagsHTML}</div>

                    <p class="vaga-descricao">
                        ${descricaoVaga}
                    </p>
                </div>

                <div class="vaga-botoes-container">
                    <button onclick="ouvirAudioVaga('${cargoVaga}', '${empresaVaga}')" class="botao botao-secundario btn-audio-vaga" title="Ouvir descrição por áudio">🔊</button>
                    <button onclick="enviarInscricao('${idVaga}')" ${jaCandidatado ? 'disabled' : ''} class="botao ${classeBotao} btn-candidatar-vaga">${textoBotao}</button>
                </div>
            </div>
        `;

        container.innerHTML += cardHtml;
    });
}

/* =========================================================================
   8. GERADOR DINÂMICO DE CURSOS NO HTML (CORRIGIDO PARA DAR PLAY)
   ========================================================================= */
function carregarCursos(listaDeCursos) {
    const container = document.getElementById('container-cursos');
    if (!container) return;
    container.innerHTML = "";

    if (!listaDeCursos || listaDeCursos.length === 0) {
        container.innerHTML = `<p style="color: white; padding: 20px;">Nenhum curso encontrado no banco de dados.</p>`;
        return;
    }

    // Salva globalmente os dados para o clique do Play encontrar
    window.listaCursosGlobal = listaDeCursos;

    listaDeCursos.forEach(curso => {
        // Trata o booleano vindo como string do banco ('false' ou false)
        const estaConcluido = curso.concluido === true || curso.concluido === 'true';
        const statusTexto = estaConcluido ? "Assistido ✓" : "Não assistido";
        const larguraProgresso = estaConcluido ? "100%" : "30%";
        
        const textoLegenda = curso.legenda || "Sem descrição disponível";
        const tituloCurso = curso.titulo || "Curso Sem Título";
        const palestranteCurso = curso.palestrante || "Trampolim";
        const idString = String(curso.id);

        const cursoHtml = `
            <div class="card-curso">
                <div class="player-video">
                    <div class="video-overlay">
                        <button onclick="assistirVideo('${idString}')" class="botao botao-principal btn-play-video">▶</button>
                    </div>

                    <span class="video-palestrante-tag">🎤 ${palestranteCurso}</span>

                    <div class="legenda-video">
                        <p class="video-legenda-texto">${textoLegenda}</p>
                    </div>
                </div>

                <div class="curso-info-container">
                    <h4 class="curso-titulo">${tituloCurso}</h4>
                    
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
   9. INTERAÇÕES E MODAIS (PLAY FUNCIONANDO)
   ========================================================================= */
function assistirVideo(idCurso) {
    if (!window.listaCursosGlobal) return;
    
    // Procura o curso na lista global viva
    const curso = window.listaCursosGlobal.find(c => String(c.id) === String(idCurso));
    
    if (curso) {
        curso.concluido = true; // Muda o status na memória
        carregarCursos(window.listaCursosGlobal); // Redesenha a tela na hora com a barra 100%
        falarMensagemAudio(`Iniciando a aula de: ${curso.titulo}`);
    } else {
        console.error("Não foi possível dar play no vídeo de ID:", idCurso);
    }
}

function enviarInscricao(idVaga) {
    if (!estadoApp.candidaturasEfetuadas.includes(idVaga)) {
        estadoApp.candidaturasEfetuadas.push(idVaga);
        document.getElementById('modal-sucesso').classList.remove('hidden');
        
        if (window.listaVagasGlobal) {
            carregarVagas(window.listaVagasGlobal);
        }
    }
}

function fecharModal() {
    document.getElementById('modal-sucesso').classList.add('hidden');
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
            ponto.style.background = ''; 
        }
    }
    
    const passoAtual = document.getElementById('tutorial-passo-' + numeroPasso);
    const pontoAtual = document.getElementById('ponto-' + numeroPasso);
    
    if (passoAtual) {
        passoAtual.classList.remove('hidden');
        passoAtual.classList.add('passo-ativo');
    }
    if (pontoAtual) {
        pontoAtual.classList.add('ativo'); 
    }
}

function mudarParaPainel() {
    mudarParaTela('vagas');
    
    // 🚀 ISSO DAQUI VAI TRAZER AS VAGAS DO ITAÚ E MERCADO LIVRE:
    carregarVagasDoBanco();
    
    // Se tiveres a função de carregar os cursos do banco, chama-a também:
    if (typeof carregarCursosDoBanco === 'function') {
        carregarCursosDoBanco();
    }
}

/* =========================================================================
   14. INICIALIZADOR AUTOMÁTICO DO APP e BUSCA DE VAGAS DO BANCO
   ========================================================================= */
async function carregarVagasDoBanco() {
    try {
        const resposta = await fetch('http://localhost:3000/api/vagas');
        const vagasDoMySQL = await resposta.json();
        
        console.log("VAGAS DO BANCO:", vagasDoMySQL);

        window.listaVagasGlobal = vagasDoMySQL;
        
        // 🚀 CONFIRA ESTA LINHA: Garanta que o nome esteja idêntico 
        // ao da função que vimos no print anterior (linha 101)!
        carregarVagas(vagasDoMySQL);            
        
    } catch (erro) {
        console.error("Erro ao puxar as vagas:", erro);
    }
}
// Inicializações Automáticas ao abrir a página
mudarParaTela('login');