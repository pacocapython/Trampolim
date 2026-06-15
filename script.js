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
        const resposta = await fetch('http://192.168.3.231:3000/api/cursos');
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

    const nomeDigitado = document.getElementById('campo-nome')?.value.trim() || "Candidato";
    const sexoSelecionado = document.getElementById('login-sexo')?.value || "Não Informado";

    let sexoFinal = sexoSelecionado;

    if (sexoSelecionado === "Outro") {
        const textoOutro = document.getElementById('campo-sexo')?.value.trim();
        if (textoOutro) {
            sexoFinal = `Outro (${textoOutro})`;
        }
    }

    estadoApp.usuarioConectado = true;
    estadoApp.nomeUsuario = nomeDigitado;
    estadoApp.sexoUsuario = sexoFinal;

    // 🚀 ATUALIZA APENAS A SIDEBAR: Coloca o nome que o usuário digitou
    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) {
        sidebarNome.textContent = nomeDigitado;
    }

    if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
    if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();

    mudarParaTela('onboarding'); 
}

function pularLoginParaTestes() {
    estadoApp.usuarioConectado = true;
    estadoApp.nomeUsuario = "Convidado de Teste";
    estadoApp.sexoUsuario = "Não Informado";

    // 🚀 ATUALIZA A SIDEBAR: Coloca "Convidado de Teste"
    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) {
        sidebarNome.textContent = "Convidado de Teste";
    }

    if (typeof mudarParaPainel === 'function') {
        mudarParaPainel();
    } else {
        mudarParaTela('vagas');
        if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
        if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();
    }
    mudarParaTela('onboarding'); 
}

function fazerLogout() {
    estadoApp.usuarioConectado = false;
    estadoApp.nomeUsuario = "";
    estadoApp.sexoUsuario = ""; 
    
    const containerVagas = document.getElementById('container-vagas');
    const containerCursos = document.getElementById('container-cursos');
    if (containerVagas) containerVagas.innerHTML = '';
    if (containerCursos) containerCursos.innerHTML = '';

    // 🚀 RESET DA SIDEBAR: Volta a ser "Candidato" ao deslogar
    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) {
        sidebarNome.textContent = "Candidato";
    }

    if (document.getElementById('campo-nome')) document.getElementById('campo-nome').value = '';
    if (document.getElementById('campo-sexo')) document.getElementById('campo-sexo').value = '';
    if (document.getElementById('login-sexo')) {
        document.getElementById('login-sexo').value = '';
        verificarGenero(); 
    }

    mudarParaTela('login');
}
function verificarGenero() {
    const selectSexo = document.getElementById('login-sexo');
    const areaOutro = document.getElementById('area-outro-genero');
    const inputSexo = document.getElementById('campo-sexo');
    
    if (selectSexo && areaOutro) {
        // Se o usuário selecionou a opção "Outro"
        if (selectSexo.value === "Outro") {
            areaOutro.classList.remove('hidden'); // Remove a classe que esconde (mostra na tela)
            if (inputSexo) inputSexo.required = true; // Torna o campo obrigatório
        } else {
            // Se ele escolheu qualquer outra coisa (Masculino, Feminino, etc.)
            areaOutro.classList.add('hidden'); // Adiciona a classe de volta (esconde da tela)
            if (inputSexo) {
                inputSexo.value = ""; // Limpa o texto que o usuário tinha digitado
                inputSexo.required = false; // Tira a obrigatoriedade para conseguir fazer login
            }
        }
    }
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
  
function baixarFicheiro() {
    const tituloFicheiro = "relatorio_acessibilidade_trampolim.txt";

    const filtroRampa = document.getElementById('filtro-rampa');
    const filtroHome = document.getElementById('filtro-homeoffice');
    const filtroLibras = document.getElementById('filtro-libras');
    const filtroNeuro = document.getElementById('filtro-neurodiversidade');
    const filtroVisual = document.getElementById('filtro-visual');
    const filtroAuditiva = document.getElementById('filtro-auditiva');

    const rampaAtiva = filtroRampa && filtroRampa.checked ? "Necessita: Infraestrutura Física (Rampas/Elevadores)" : null;
    const homeofficeAtiva = filtroHome && filtroHome.checked ? "Necessita: Trabalho em Home Office / Remoto" : null;
    const librasAtiva = filtroLibras && filtroLibras.checked ? "Necessita: Tradução em Língua de Sinais (Libras)" : null;
    const neuroAtiva = filtroNeuro && filtroNeuro.checked ? "Necessita: Apoio à Neurodiversidade (Autismo, TDAH, etc.)" : null;
    const visualAtiva = filtroVisual && filtroVisual.checked ? "Necessita: Apoio para Deficiência Visual" : null;
    const auditivaAtiva = filtroAuditiva && filtroAuditiva.checked ? "Necessita: Apoio para Deficiência Auditiva" : null;

    // Junta apenas as opções marcadas nos checkboxes
    const listaRequisitos = [rampaAtiva, homeofficeAtiva, librasAtiva, neuroAtiva, visualAtiva, auditivaAtiva].filter(Boolean);

    // 2. CAPTURA DO LAUDO MÉDICO ANEXADO
    const inputLaudo = document.getElementById('upload-comprovante');
    let nomeLaudoMedico = "Não anexado";
    if (inputLaudo && inputLaudo.files && inputLaudo.files.length > 0) {
        nomeLaudoMedico = inputLaudo.files[0].name;
    }

    // 3. 🕵️‍♂️ DETECTOR DE INTERFACE (SÓ ENTRA NO RELATÓRIO SE ESTIVER LIGADO NA HORA)
    let blocosInterface = [];

    // A. Letra Ampliada
    const btnTamanho = document.getElementById('btn-tamanho-letra');
    if (document.body.classList.contains('fonte-grande') || document.body.classList.contains('texto-grande') || (btnTamanho && btnTamanho.textContent.includes('A-'))) {
        blocosInterface.push("- Letra Ampliada (A+): Ativo");
    }

    // B. Modo Leitura Focada
    const btnLeitura = document.getElementById('btn-modo-leitura');
    if ((btnLeitura && btnLeitura.classList.contains('ativo')) || (btnLeitura && btnLeitura.textContent.toLowerCase().includes('desativar')) || (btnLeitura && btnLeitura.style.backgroundColor !== "")) {
        blocosInterface.push("- Modo Leitura Focada: Ativo");
    }

    // C. Otimização de Cores (Daltonismo) -> 🚀 AGORA TRATADO COMO BOTÃO DE INTERFACE!
  // C. Otimização de Cores (Daltonismo)
    const btnDaltonismo = document.getElementById('btn-daltonismo');
    if (btnDaltonismo && (
        btnDaltonismo.classList.contains('ativo') || 
        btnDaltonismo.classList.contains('active') ||
        btnDaltonismo.textContent.toLowerCase().includes('desativar') ||
        btnDaltonismo.textContent.toLowerCase().includes('padrão') ||
        btnDaltonismo.style.backgroundColor !== ""
    )) {
        blocosInterface.push("- Otimização de Cores (Daltonismo): Ativo");
    }
    // D. Reprodutor de Voz
    const btnAudio = document.getElementById('botao-audio');
    const avisoAudio = document.getElementById('aviso-audio');
    if ((avisoAudio && !avisoAudio.classList.contains('hidden')) || (btnAudio && btnAudio.classList.contains('ativo')) || (btnAudio && btnAudio.title.toLowerCase().includes('desativar')) || (btnAudio && btnAudio.textContent.toLowerCase().includes('parar'))) {
        blocosInterface.push("- Reprodutor de Voz de Apoio: Ativo");
    }

    // 4. HISTÓRICO DE CANDIDATURAS
    const listaCandidaturas = (typeof estadoApp !== 'undefined' && estadoApp.candidaturasEfetuadas) ? estadoApp.candidaturasEfetuadas : [];

    // 5. MONTAGEM DO TEXTO DO RELATÓRIO 100% EM PORTUGUÊS
    let dadosEscritos = `===================================================\n` +
                        `RELATÓRIO ASSISTIVO COMPLETO - PORTAL TRAMPOLIM\n` +
                        `===================================================\n` +
                        `Data de Emissão: ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}\n\n` +
                        `[CONDIÇÕES DE ACESSIBILIDADE SELECIONADAS]:\n` +
                        `${listaRequisitos.length > 0 ? listaRequisitos.map(req => `- [X] ${req}`).join('\n') : '- Nenhuma preferência ativa selecionada.'}\n` +
                        `- Documento de Laudo Anexado: ${nomeLaudoMedico}\n\n`;

    // Só adiciona o bloco de interface se alguma das ferramentas estiver de fato ligada
    if (blocosInterface.length > 0) {
        dadosEscritos += `[PREFERÊNCIAS DE INTERFACE VISUAL & ACESSIBILIDADE]:\n` +
                         blocosInterface.join('\n') + `\n\n`;
    }

    dadosEscritos += `[HISTÓRICO DE CANDIDATURAS (Vagas Escolhidas)]:\n` +
                     `${listaCandidaturas.length > 0 ? listaCandidaturas.map(vaga => `- Categoria/ID: ${vaga}`).join('\n') : '- Nenhuma candidatura realizada nesta sessão.'}\n` +
                     `===================================================`;

    // 6. DISPARADOR DE DOWNLOAD NATIVO
    const arquivoBlob = new Blob([dadosEscritos], { type: "text/plain" });
    const linkDownload = document.createElement('a');
    linkDownload.href = URL.createObjectURL(arquivoBlob);
    linkDownload.download = tituloFicheiro;
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
    carregarVagasDoBanco();
    carregarCursosDoBanco();
    
    if (typeof carregarCursosDoBanco === 'function') {
        carregarCursosDoBanco();
    }
}
async function carregarVagasDoBanco() {
    try {
        const resposta = await fetch('http://192.168.3.231:3000/api/vagas');
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
function salvarPerfil(event) {
    // Trava o refresh da página
    event.preventDefault(); 
    
    console.log("Requisitos salvos com sucesso!");
    
    // Avança para as vagas com a memória intacta
    mudarParaTela('vagas'); 
}
function mostrarNomeDoArquivo() {
    // 1. Pega o input de arquivo e o local onde o texto deve aparecer
    const input = document.getElementById('upload-comprovante');
    const textoNome = document.getElementById('nome-arquivo-selecionado');

    // 2. Verifica se os elementos existem e se o usuário realmente escolheu um arquivo
    if (input && textoNome && input.files && input.files.length > 0) {
        // Pega o nome do primeiro arquivo selecionado
        const nomeDoArquivo = input.files[0].name;
        
        // Substitui o "Nenhum arquivo selecionado" pelo nome real do arquivo!
        textoNome.textContent = "📄 " + nomeDoArquivo;
        textoNome.style.color = "#007bff"; // Opcional: muda a cor pra dar um destaque de sucesso
    } else if (textoNome) {
        // Caso dê algum erro ou limpe a seleção, volta ao texto padrão
        textoNome.textContent = "Nenhum arquivo selecionado";
        textoNome.style.color = ""; 
    }
}