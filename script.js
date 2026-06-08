        // 1. ESTADO INTERNO DO APP
        const estadoApp = {
            usuarioConectado: false,
            tamanhoFonteAmpliado: false,
            fonteDislexiaAtiva: false,
            leitorAudioLigado: false,
            candidaturasEfetuadas: [] // Guarda os IDs das vagas candidatadas
        };

        // 2. BANCO DE DADOS DE VAGAS SIMULADO
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
            }
        ];

        // 3. BANCO DE DADOS DE CURSOS SIMULADO
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

        // 4. SISTEMA DE TRANSIÇÃO DE TELAS (Usando apenas .classList.add / remove)
        function mudarParaTela(nomeTela) {
            // Esconde todas as 3 seções de fluxo primeiro
            document.getElementById('tela-login').classList.add('hidden');
            document.getElementById('tela-onboarding').classList.add('hidden');
            document.getElementById('painel-dashboard').classList.add('hidden');

            // Mostra apenas a que o utilizador deseja
            if (nomeTela === 'login') {
                document.getElementById('tela-login').classList.remove('hidden');
            } else if (nomeTela === 'onboarding') {
                document.getElementById('tela-onboarding').classList.remove('hidden');
            } else if (nomeTela === 'vagas') {
                document.getElementById('painel-dashboard').classList.remove('hidden');
                mudarParaAba('vagas'); // Já inicia na aba de vagas
            }
        }

        // 5. SISTEMA DE TROCA DE ABAS DO DASHBOARD (Vagas, Perfil, Cursos, Ajustes)
        function mudarParaAba(nomeAba) {
            // Lista de todas as abas criadas no HTML
            const abas = ['vagas', 'perfil', 'cursos', 'ajustes'];

            abas.forEach(aba => {
                const elementoAba = document.getElementById(`aba-${aba}`);
                const btnLateral = document.getElementById(`btn-lateral-${aba}`);
                const btnMobile = document.getElementById(`btn-mobile-${aba}`);

                if (aba === nomeAba) {
                    elementoAba.classList.remove('hidden'); // Mostra a aba clicada
                    
                    // Coloca o botão com a classe "ativo" para destacar no menu
                    btnLateral.classList.add('ativo');
                    btnMobile.classList.add('ativo');
                } else {
                    elementoAba.classList.add('hidden'); // Esconde as outras abas
                    
                    // Remove destaque
                    btnLateral.classList.remove('ativo');
                    btnMobile.classList.remove('ativo');
                }
            });
        }

        // 6. EVENTOS DE LOGIN
        function fazerLogin(event) {
            event.preventDefault(); // Evita o recarregamento natural da página
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

        // 7. GERADOR DINÂMICO DE VAGAS NO HTML
        function carregarVagas() {
            const container = document.getElementById('container-vagas');
            container.innerHTML = ""; // Limpa a área de listagem

            bancoVagas.forEach(vaga => {
                // Cria as etiquetas/tags HTML
                let tagsHTML = "";
                vaga.tags.forEach(tag => {
                    tagsHTML += `<span class="card-tag">${tag}</span>`;
                });

                // Verifica se já clicou para concorrer à vaga
                const jaCandidatado = estadoApp.candidaturasEfetuadas.includes(vaga.id);
                const classeBotao = jaCandidatado ? "botao-secundario" : "botao-principal";
                const textoBotao = jaCandidatado ? "Candidatado ✓" : "Candidatar-se";

                // Adiciona o bloco HTML completo da vaga
                const cardHtml = `
                    <div class="card-vaga">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <span style="color: var(--amarelo-acao); font-weight: 800; font-size: 13px; text-transform: uppercase;">${vaga.empresa}</span>
                            <h3 style="font-size: 22px; font-weight: bold;">${vaga.cargo}</h3>
                            <p style="font-size: 14px; color: var(--cinza-claro); font-weight: bold;">📍 ${vaga.local} | Salário: ${vaga.salario}</p>
                            
                            <div>${tagsHTML}</div>

                            <p style="font-size: 14px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid var(--azul-borda); margin-top: 8px;">
                                ${vaga.descricao}
                            </p>
                        </div>

                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button onclick="ouvirAudioVaga('${vaga.cargo}', '${vaga.empresa}')" class="botao botao-secundario" style="padding: 12px;" title="Ouvir descrição por áudio">🔊</button>
                            <button onclick="enviarInscricao('${vaga.id}')" ${jaCandidatado ? 'disabled' : ''} class="botao ${classeBotao}" style="flex-grow: 1;">${textoBotao}</button>
                        </div>
                    </div>
                `;

                container.innerHTML += cardHtml;
            });
        }

        // 8. GERADOR DINÂMICO DE CURSOS NO HTML
        function carregarCursos() {
            const container = document.getElementById('container-cursos');
            container.innerHTML = "";

            bancoCursos.forEach(curso => {
                const statusTexto = curso.concluido ? "Assistido ✓" : "Não assistido";
                const larguraProgresso = curso.concluido ? "100%" : "30%";

                const cursoHtml = `
                    <div class="card-curso">
                        <!-- Player de Vídeo Estético -->
                        <div class="player-video">
                            <!-- Botão de Iniciar Vídeo -->
                            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
                                <button onclick="assistirVideo('${curso.id}')" class="botao botao-principal" style="border-radius: 50%; width: 56px; height: 56px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 20px;">▶</button>
                            </div>

                            <span style="position: absolute; top: 12px; left: 12px; background: var(--azul-escuro); border: 1px solid var(--amarelo-acao); color: var(--amarelo-acao); font-size: 11px; padding: 4px 8px; border-radius: 8px; font-weight: bold;">🎤 ${curso.palestrante}</span>

                            <!-- Legendas no Vídeo -->
                            <div class="legenda-video">
                                <p style="color: var(--amarelo-acao); font-size: 12px; font-weight: 900; text-transform: uppercase;">${curso.legenda}</p>
                            </div>
                        </div>

                        <!-- Info do Curso -->
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <h4 style="font-size: 18px; font-weight: bold;">${curso.titulo}</h4>
                            
                            <!-- Barra de progresso visível -->
                            <div style="margin-top: 4px;">
                                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: var(--cinza-claro); margin-bottom: 4px;">
                                    <span>Progresso do Utilizador</span>
                                    <span>${statusTexto}</span>
                                </div>
                                <div style="width: 100%; bg-color: var(--azul-escuro); background: #091124; height: 12px; border-radius: 10px; border: 1px solid var(--azul-borda); overflow: hidden; padding: 2px;">
                                    <div style="background-color: var(--amarelo-acao); width: ${larguraProgresso}; height: 100%; border-radius: 10px; transition: width 0.3s;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                container.innerHTML += cursoHtml;
            });
        }

        // 9. FUNÇÕES DE SUPORTE ÀS CANDIDATURAS E MODAL
        function enviarInscricao(idVaga) {
            if (!estadoApp.candidaturasEfetuadas.includes(idVaga)) {
                estadoApp.candidaturasEfetuadas.push(idVaga);
                
                // Exibe o modal de sucesso na tela
                document.getElementById('modal-sucesso').classList.remove('hidden');
                
                // Recarrega as vagas no HTML para pintar o botão de cinza
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
                carregarCursos(); // Recarrega os cursos no HTML para atualizar a barra de progresso
                falarMensagemAudio(`Iniciando a aula de: ${curso.titulo}.`);
            }
        }

        // Salvar Perfil do Formulário
        function salvarPerfil(event) {
            event.preventDefault();
            mudarParaAba('vagas'); // Retorna às vagas automaticamente
            falarMensagemAudio("As suas preferências de acessibilidade foram atualizadas com sucesso!");
        }

        // 10. ACESSIBILIDADE VISUAL (Aumentar tamanho de letra e Fonte de Dislexia)
        function alternarTamanhoTexto() {
            const corpo = document.getElementById('corpo-app');
            estadoApp.tamanhoFonteAmpliado = !estadoApp.tamanhoFonteAmpliado;

            if (estadoApp.tamanhoFonteAmpliado) {
                corpo.classList.remove('texto-padrao');
                corpo.classList.add('texto-grande');
                falarMensagemAudio("Tamanho da fonte aumentado para leitura confortável.");
            } else {
                corpo.classList.remove('texto-grande');
                corpo.classList.add('texto-padrao');
                falarMensagemAudio("Tamanho de fonte padrão restaurado.");
            }
        }

        function alternarFonteDislexia() {
            const corpo = document.getElementById('corpo-app');
            estadoApp.fonteDislexiaAtiva = !estadoApp.fonteDislexiaAtiva;

            if (estadoApp.fonteDislexiaAtiva) {
                corpo.classList.add('fonte-dislexia');
                falarMensagemAudio("Fonte adaptada para dislexia ativada.");
            } else {
                corpo.classList.remove('fonte-dislexia');
                falarMensagemAudio("Fonte padrão restaurada.");
            }
        }

        // 11. RECURSO DE SÍNTESE DE VOZ (ÁUDIO ASSISTIVO)
        function alternarLeitorAudio() {
            estadoApp.leitorAudioLigado = !estadoApp.leitorAudioLigado;
            const botao = document.getElementById('botao-audio');

            if (estadoApp.leitorAudioLigado) {
                // Altera as cores do botão para indicar ativado
                botao.style.backgroundColor = "var(--amarelo-acao)";
                botao.style.color = "var(--azul-escuro)";
                
                falarTextoAudio("O leitor de apoio está ativado. Clique nos botões de áudio para ler.");
            } else {
                botao.style.backgroundColor = "var(--azul-card)";
                botao.style.color = "var(--amarelo-acao)";
                pararAudio();
            }
        }

        function falarTextoAudio(textoParaFalar) {
            // Verifica se o navegador suporta síntese de voz nativa
            if (!('speechSynthesis' in window)) return;

            window.speechSynthesis.cancel(); // Cancela áudios anteriores na fila

            const fala = new SpeechSynthesisUtterance(textoParaFalar);
            fala.lang = 'pt-PT'; // Idioma configurado
            fala.rate = 1.1;     // Velocidade da leitura

            // Exibe e atualiza o banner visual no topo da tela
            const banner = document.getElementById('aviso-audio');
            const textoDoBanner = document.getElementById('texto-leitura');
            banner.classList.remove('hidden');
            textoDoBanner.innerText = textoParaFalar.length > 50 ? textoParaFalar.substring(0, 50) + "..." : textoParaFalar;

            // Quando terminar de falar, esconde o aviso visual
            fala.onend = function() {
                banner.classList.add('hidden');
            };

            window.speechSynthesis.speak(fala);
        }

        function pararAudio() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            document.getElementById('aviso-audio').classList.add('hidden');
        }

        function falarMensagemAudio(texto) {
            if (estadoApp.leitorAudioLigado) {
                falarTextoAudio(texto);
            }
        }

        function ouvirAudioVaga(cargo, empresa) {
            falarTextoAudio(`Anúncio da vaga de: ${cargo}, na empresa ${empresa}. Verifique as marcas de suporte físico e remotos no painel.`);
        }

        // 12. EXPORTADOR DE FICHEIROS (Para baixar o relatório de acessibilidade)
        function baixarFicheiro(formato) {
            const tituloFicheiro = "relatorio_acessibilidade_trampolim";
            let dadosEscritos = "";
            let tipoDoFicheiro = "text/plain";
            let extensao = "txt";

            // Detalha no texto quais as preferências estão marcadas no formulário
            const rampaAtiva = document.getElementById('filtro-rampa').checked ? "Necessita: Infraestrutura Física (Rampas/Elevadores)" : null;
            const homeofficeAtiva = document.getElementById('filtro-homeoffice').checked ? "Necessita: Atividades em Home Office" : null;
            const librasAtiva = document.getElementById('filtro-libras').checked ? "Necessita: Tradução de Linguagem de Sinais (Libras)" : null;

            const listaRequisitos = [rampaAtiva, homeofficeAtiva, librasAtiva].filter(Boolean);

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

            // Cria o link de download na memória do navegador e força a descarga do utilizador
            const arquivoBlob = new Blob([dadosEscritos], { type: tipoDoFicheiro });
            const linkDownload = document.createElement('a');
            linkDownload.href = URL.createObjectURL(arquivoBlob);
            linkDownload.download = `${tituloFicheiro}.${extensao}`;
            document.body.appendChild(linkDownload);
            linkDownload.click();
            document.body.removeChild(linkDownload);
        }

        // 13. INICIALIZADOR AUTOMÁTICO
        carregarVagas();
        carregarCursos();
        mudarParaTela('login');
