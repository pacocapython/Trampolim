// estaado do app e da conexão com o banco de dados
const estadoApp = {
    usuarioConectado: false,
    tamanhoFonteAmpliado: false,
    fonteDislexiaAtiva: false,
    leitorAudioLigado: false,
    candidaturasEfetuadas: [],
    nomeUsuario: "",
    telefoneUsuario: "",
    sexoUsuario: "",
    email_cpfUsuario:"",
    senhaUsuario: "",
};

// Buscando cursos do mysql
async function carregarCursosDoBanco() {
    try {
        const resposta = await fetch('https://trampolim-production.up.railway.app/api/cursos');
        const cursosDoMySQL = await resposta.json();
        
        console.log("Cursos vindos do MySQL:", cursosDoMySQL);

        carregarCursos(cursosDoMySQL); 

    } catch (erro) {
        console.error("Erro ao puxar os cursos do servidor:", erro);
    }
}

// sistema de transitar entre as telas de login, explicação e a tela principal
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

// sistema de mudar de abas vagas, perfil assistivo, cursos, ajustes e da ficha
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

//area de login cadastro do trampolimmmm
function fazerLogin(event) {
    if (event) event.preventDefault();

    const nomeDigitado = document.getElementById('campo-nome')?.value.trim() || "Candidato";
    const telefoneDigitado = document.getElementById('campo-numero')?.value.trim() || "Não informado"; 
    const sexoSelecionado = document.getElementById('login-sexo')?.value || "Não Informado";
    
    const emailCpfDigitado = document.getElementById('campo-email')?.value.trim() || ""; 
    const senhaDigitada = document.getElementById('campo-senha')?.value || "";

    let sexoFinal = sexoSelecionado;
    if (sexoSelecionado === "Outro") {
        const textoOutro = document.getElementById('campo-sexo')?.value.trim();
        if (textoOutro) {
            sexoFinal = `Outro (${textoOutro})`;
        }
    }

    // atualiza o estado do app
    estadoApp.usuarioConectado = true;
    estadoApp.nomeUsuario = nomeDigitado;
    estadoApp.telefoneUsuario = telefoneDigitado; 
    estadoApp.sexoUsuario = sexoFinal;
    estadoApp.email_cpfUsuario = emailCpfDigitado; 
    estadoApp.senhaUsuario = senhaDigitada;        

    // atualiza o nome de ususario na tela principal
    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) sidebarNome.textContent = nomeDigitado;
    const mobileNome = document.getElementById('mobile-nome');
    if (mobileNome) mobileNome.textContent = nomeDigitado;

    if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
    if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();

    //envia estes dados preenchidos para o server
    const dadosParaEnviar = {
        nome: estadoApp.nomeUsuario,
        telefone: estadoApp.telefoneUsuario,
        genero: estadoApp.sexoUsuario,
        email: estadoApp.email_cpfUsuario.includes('@') ? estadoApp.email_cpfUsuario : null,
        cpf: !estadoApp.email_cpfUsuario.includes('@') ? estadoApp.email_cpfUsuario : null,
        senha: estadoApp.senhaUsuario
    };

    console.log("DADOS ENVIADOS PARA O RAILWAY:", dadosParaEnviar);

    fetch('https://trampolim-production.up.railway.app/api/cadastro', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaEnviar)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        console.log("Resposta do servidor:", dados);
    })
    .catch(erro => {
        console.error("Erro ao enviar dados para o servidor:", erro);
    });

    mudarParaTela('onboarding'); 
}

function fazerLogout() {
    estadoApp.usuarioConectado = false;
    estadoApp.nomeUsuario = "";
    estadoApp.telefoneUsuario = "";
    estadoApp.sexoUsuario = ""; 
    
    const containerVagas = document.getElementById('container-vagas');
    const containerCursos = document.getElementById('container-cursos');
    if (containerVagas) containerVagas.innerHTML = '';
    if (containerCursos) containerCursos.innerHTML = '';

    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) sidebarNome.textContent = "Utilizador";
    
    const mobileNome = document.getElementById('mobile-nome');
    if (mobileNome) mobileNome.textContent = "Utilizador";

    if (document.getElementById('campo-nome')) document.getElementById('campo-nome').value = '';
    if (document.getElementById('campo-numero')) document.getElementById('campo-numero').value = '';
    if (document.getElementById('campo-sexo')) document.getElementById('campo-sexo').value = '';
    if (document.getElementById('login-sexo')) {
        document.getElementById('login-sexo').value = '';
        verificarGenero(); 
    }

    mudarParaTela('login');
}
function pularLoginParaTestes() {
    // preenche o estado com dados fictios para a ficha e banco de dados
    estadoApp.usuarioConectado = true;
    estadoApp.nomeUsuario = "Convidado de Teste";
    estadoApp.telefoneUsuario = "999999999";
    estadoApp.sexoUsuario = "Não Informado";
    estadoApp.email_cpfUsuario = "teste@convidado.com";
    estadoApp.senhaUsuario = "123456";

    // atualiza para  perfil mobile
    const sidebarNome = document.getElementById('sidebar-nome');
    if (sidebarNome) sidebarNome.textContent = "Convidado de Teste";
    
    const mobileNome = document.getElementById('mobile-nome');
    if (mobileNome) mobileNome.textContent = "Convidado de Teste";

    // carrega os dados da API do railway
    if (typeof carregarVagasDoBanco === 'function') carregarVagasDoBanco();
    if (typeof carregarCursosDoBanco === 'function') carregarCursosDoBanco();

    //avança pra tela do onboarding
    mudarParaTela('onboarding'); 
}

// verifica o sexo
function verificarGenero() {
    const selectSexo = document.getElementById('login-sexo');
    const areaOutro = document.getElementById('area-outro-genero');
    const inputSexo = document.getElementById('campo-sexo');
    
    if (selectSexo && areaOutro) {
        if (selectSexo.value === "Outro") {
            areaOutro.classList.remove('hidden');
            if (inputSexo) inputSexo.required = true;
        } else {
            areaOutro.classList.add('hidden');
            if (inputSexo) {
                inputSexo.value = "";
                inputSexo.required = false;
            }
        }
    }
}

// gera as vagas na area de vagas
function carregarVagas(listaDeVagas) {
    const container = document.getElementById('container-vagas');
    if (!container) return;
    container.innerHTML = "";   

    if (!listaDeVagas || listaDeVagas.length === 0) {
        container.innerHTML = `<p style="color: white; padding: 20px;">Nenhuma vaga encontrada no banco de dados.</p>`;
        return;
    }

    listaDeVagas.forEach(vaga => {
        let tagsHTML = "";
        const tags = Array.isArray(vaga.tags) ? vaga.tags : (vaga.tags ? vaga.tags.split(',') : []);
        tags.forEach(tag => {
            if(tag.trim()) {
                tagsHTML += `<span class="card-tag">${tag.trim()}</span>`;
            }
        });

        const jaCandidatado = estadoApp.candidaturasEfetuadas.includes(vaga.id);
        const classeBotao = jaCandidatado ? "botao-secundario" : "botao-principal";
        const textoBotao = jaCandidatado ? "Candidatado ✓" : "Candidatar-se";

        const idVaga = vaga.id || "Não informado";
        const cargoVaga = vaga.cargo || "Vaga Sem Título";
        const empresaVaga = vaga.empresa || "Empresa Não Informada";
        const localVaga = vaga.local || "Não especificado";
        const salarioVaga = vaga.salario || "Não informado";
        const descricaoVaga = vaga.descricao || "Sem descrição disponível.";

        const cardHtml = `
            <div class="card-vaga">
                <div class="vaga-conteudo">
                    <span class="vaga-empresa">${empresaVaga}</span>
                    <h3 class="vaga-titulo">${cargoVaga}</h3>
                    <p class="vaga-info">📍 ${localVaga} | Salário: ${salarioVaga}</p>
                    <div>${tagsHTML}</div>
                    <p class="vaga-descricao">${descricaoVaga}</p>
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

// gera os cursos na aba de cursos
function carregarCursos(listaDeCursos) {
    const container = document.getElementById('container-cursos');
    if (!container) return;
    container.innerHTML = "";

    if (!listaDeCursos || listaDeCursos.length === 0) {
        container.innerHTML = `<p style="color: white; padding: 20px;">Nenhum curso encontrado no banco de dados.</p>`;
        return;
    }

    window.listaCursosGlobal = listaDeCursos;

    listaDeCursos.forEach(curso => {
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

// algumas interações de apertar, inseriri dados, de clicar em botoes e exercer uma função
function assistirVideo(idCurso) {
    if (!window.listaCursosGlobal) return;
    
    const curso = window.listaCursosGlobal.find(c => String(c.id) === String(idCurso));
    
    if (curso) {
        curso.concluido = true;
        carregarCursos(window.listaCursosGlobal);
        falarMensagemAudio(`Iniciando a aula de: ${curso.titulo}`);
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

// configura os controles da acessibilidade visual
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

// configura o recurso de voz 
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

    const listaRequisitos = [rampaAtiva, homeofficeAtiva, librasAtiva, neuroAtiva, visualAtiva, auditivaAtiva].filter(Boolean);

    const inputLaudo = document.getElementById('upload-comprovante');
    let nomeLaudoMedico = "Não anexado";
    if (inputLaudo && inputLaudo.files && inputLaudo.files.length > 0) {
        nomeLaudoMedico = inputLaudo.files[0].name;
    }

    let blocosInterface = [];

    const btnTamanho = document.getElementById('btn-tamanho-letra');
    if (document.body.classList.contains('fonte-grande') || document.body.classList.contains('texto-grande') || (btnTamanho && btnTamanho.textContent.includes('A-'))) {
        blocosInterface.push("- Letra Ampliada (A+): Ativo");
    }

    const btnLeitura = document.getElementById('btn-modo-leitura');
    if ((btnLeitura && btnLeitura.classList.contains('ativo')) || (btnLeitura && btnLeitura.textContent.toLowerCase().includes('desativar')) || (btnLeitura && btnLeitura.style.backgroundColor !== "")) {
        blocosInterface.push("- Modo Leitura Focada: Ativo");
    }

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

    const btnAudio = document.getElementById('botao-audio');
    const avisoAudio = document.getElementById('aviso-audio');
    if ((avisoAudio && !avisoAudio.classList.contains('hidden')) || (btnAudio && btnAudio.classList.contains('ativo')) || (btnAudio && btnAudio.title.toLowerCase().includes('desativar')) || (btnAudio && btnAudio.textContent.toLowerCase().includes('parar'))) {
        blocosInterface.push("- Reprodutor de Voz de Apoio: Ativo");
    }

    const listaCandidaturas = estadoApp.candidaturasEfetuadas || [];

    // configura o relatorio assistivo
    let dadosEscritos = `===================================================\n` +
                        `RELATÓRIO ASSISTIVO COMPLETO - PORTAL TRAMPOLIM\n` +
                        `===================================================\n` +
                        `Data de Emissão: ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}\n\n` +
                        `[DADOS DO CANDIDATO]:\n` +
                        `- Nome de Usuário: ${estadoApp.nomeUsuario || "Não informado"}\n` +
                        `- Telefone:        ${estadoApp.telefoneUsuario || "Não informado"}\n` +
                        `- Sexo / Gênero:   ${estadoApp.sexoUsuario || "Não informado"}\n\n` +
                        `[CONDIÇÕES DE ACESSIBILIDADE SELECIONADAS]:\n` +
                        `${listaRequisitos.length > 0 ? listaRequisitos.map(req => `- [X] ${req}`).join('\n') : '- Nenhuma preferência ativa selecionada.'}\n` +
                        `- Documento de Laudo Anexado: ${nomeLaudoMedico}\n\n`;

    if (blocosInterface.length > 0) {
        dadosEscritos += `[PREFERÊNCIAS DE INTERFACE VISUAL & ACESSIBILIDADE]:\n` + blocosInterface.join('\n') + `\n\n`;
    }

    dadosEscritos += `[HISTÓRICO DE CANDIDATURAS (Vagas Escolhidas)]:\n` +
                     `${listaCandidaturas.length > 0 ? listaCandidaturas.map(vaga => `- Categoria/ID: ${vaga}`).join('\n') : '- Nenhuma candidatura realizada nesta sessão.'}\n` +
                     `===================================================`;

    const arquivoBlob = new Blob([dadosEscritos], { type: "text/plain" });
    const linkDownload = document.createElement('a');
    linkDownload.href = URL.createObjectURL(arquivoBlob);
    linkDownload.download = tituloFicheiro;
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
}

//configura a logica de passos do tutorial do trampolim
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
}

async function carregarVagasDoBanco() {
    try {
        const resposta = await fetch('https://trampolim-production.up.railway.app/api/vagas');
        const vagasDoMySQL = await resposta.json();
        
        console.log("VAGAS DO BANCO:", vagasDoMySQL);
        window.listaVagasGlobal = vagasDoMySQL;
        carregarVagas(vagasDoMySQL);            
        
    } catch (erro) {
        console.error("Erro ao puxar as vagas:", erro);
    }
}

function salvarPerfil(event) {
    if (event) event.preventDefault(); 
    console.log("Requisitos salvos com sucesso!");
    mudarParaTela('vagas'); 
}

function mostrarNomeDoArquivo() {
    const input = document.getElementById('upload-comprovante');
    const textoNome = document.getElementById('nome-arquivo-selecionado');

    if (input && textoNome && input.files && input.files.length > 0) {
        textoNome.textContent = "📄 " + input.files[0].name;
        textoNome.style.color = "#007bff"; 
    } else if (textoNome) {
        textoNome.textContent = "Nenhum arquivo selecionado";
        textoNome.style.color = ""; 
    }
}

mudarParaTela('login');

// Inicialização Inicial obrigatória
mudarParaTela('login');
