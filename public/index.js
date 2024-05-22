const ws = new WebSocket(`ws://${window.location.hostname}:3031`);

// Quando o DOM estiver carregado, configure os listeners
document.addEventListener('DOMContentLoaded', function() {    
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    const mainContent = document.getElementById('main-content');

    // Função para carregar a chave API do arquivo .env
    async function getApiKey() {
        const response = await fetch('/johnnyzap-classic/.env');
        const text = await response.text();
        const lines = text.split('\n');
        for (let line of lines) {
            if (line.startsWith('API_KEY=')) {
                return line.split('=')[1].trim();
            }
        }
        return null;
    }

    // Função para mostrar o modal de verificação da chave API
    function showApiKeyModal() {
        const modalContent = `
            <div id="apiKeyModal" class="modal">
                <div class="modal-content">
                    <h2>Configurar conexão</h2>
                    <input type="password" id="apiKeyInput" placeholder="Global API Key">
                    <button id="connectButton">Conectar</button>
                    <p id="error-message" class="error-message"></p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);
    }

    // Função para verificar a chave API
    async function verifyApiKey() {
        const validApiKey = await getApiKey();
        document.getElementById('connectButton').addEventListener('click', function() {
            const apiKey = document.getElementById('apiKeyInput').value;
            if (apiKey === validApiKey) {
                document.getElementById('apiKeyModal').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            } else {
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Chave API inválida. Tente novamente.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Mostrar o modal de verificação de chave API e configurar a verificação
    showApiKeyModal();
    verifyApiKey();

    // Anexa event listeners ao mainContent para delegação
    mainContent.addEventListener('click', function(event) {
        if (event.target.id === 'atualizarLista') {
            ws.send(JSON.stringify({ action: 'atualizarLista' }));
        } else if (event.target.id === 'atualizarListaRapida') {
            ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
        } else if (event.target.id === 'adicionarFluxo') {
            const existingModal = document.getElementById('addFluxoModalBackdrop');
            if (existingModal) existingModal.remove();
            const modalContent = `
                <div id="addFluxoModalBackdrop">
                    <div id="addFluxoModal">
                        <div id="closeModal">&times;</div>
                        <h2>Adicionar Fluxo</h2>
                        <label for="fluxoUrl">URL do Fluxo:</label>
                        <input type="text" id="fluxoUrl" placeholder="URL do seu Fluxo">
                        <label for="fluxoNome">Nome do Fluxo:</label>
                        <input type="text" id="fluxoNome" placeholder="Nome do seu Fluxo">
                        <label for="fluxoGatilho">Gatilho do Fluxo:</label>
                        <input type="text" id="fluxoGatilho" placeholder="Gatilho do seu Fluxo">
                        <button id="confirmarAdicao">Confirmar Adição</button>
                    </div>
                    <div id="response"></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalContent);
            document.getElementById('closeModal').addEventListener('click', function() {
                document.getElementById('addFluxoModalBackdrop').remove();
            });
            document.getElementById('confirmarAdicao').addEventListener('click', function() {
                const urlFluxo = document.getElementById('fluxoUrl').value;
                const nomeFluxo = document.getElementById('fluxoNome').value;
                const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
                ws.send(JSON.stringify({
                    action: 'confirmarAdicao',
                    data: {
                        url: urlFluxo,
                        nome: nomeFluxo,
                        gatilho: gatilhoFluxo
                    }
                }));
                alert('Fluxo adicionado com sucesso!');
                ws.send(JSON.stringify({ action: 'atualizarLista' }));
                document.getElementById('addFluxoModalBackdrop').remove();
            });
        } else if (event.target.id === 'adicionarRespostaRapida') {
            const existingModal = document.getElementById('addFluxoModalBackdrop');
            if (existingModal) existingModal.remove();
            const modalContent = `
                <div id="addFluxoModalBackdrop">
                    <div id="addFluxoModal">
                        <div id="closeModal">&times;</div>
                        <h2>Adicionar Resposta Rápida</h2>
                        <label for="fluxoNome">Nome do Fluxo:</label>
                        <input type="text" id="fluxoNome" placeholder="Nome do seu Fluxo que será Disparado">
                        <label for="fluxoGatilho">Frase de Disparo:</label>
                        <input type="text" id="fluxoGatilho" placeholder="Frase que irá disparar o Fluxo">
                        <button id="confirmarAdicaoRapida">Confirmar Adição</button>
                    </div>
                    <div id="response"></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalContent);
            document.getElementById('closeModal').addEventListener('click', function() {
                document.getElementById('addFluxoModalBackdrop').remove();
            });
            document.getElementById('confirmarAdicaoRapida').addEventListener('click', function() {
                const nomeFluxo = document.getElementById('fluxoNome').value;
                const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
                ws.send(JSON.stringify({
                    action: 'confirmarAdicaoRapida',
                    data: {
                        nome: nomeFluxo,
                        gatilho: gatilhoFluxo
                    }
                }));
                alert('Resposta Rápida adicionada com sucesso!');
                ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
                document.getElementById('addFluxoModalBackdrop').remove();
            });
        } else if (event.target.id === 'atualizarListaRmkt') {
            ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
        } else if (event.target.id === 'atualizarGrupo') {
            ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
        } else if (event.target.id === 'adicionarRmkt') {
            const existingModal = document.getElementById('addFluxoModalBackdrop');
            if (existingModal) existingModal.remove();
            const modalContent = `
                <div id="addFluxoModalBackdrop">
                    <div id="addFluxoModal">
                        <div id="closeModal">&times;</div>
                        <h2>Adicionar Remarketing</h2>
                        <label for="fluxoUrl">URL do Fluxo de Remarketing :</label>
                        <input type="text" id="fluxoUrl" placeholder="URL do seu Remarketing">
                        <label for="fluxoNome">Nome do Fluxo Principal:</label>
                        <input type="text" id="fluxoNome" placeholder="Nome do Fluxo que o Remarketing está atrelado">
                        <label for="fluxoGatilho">Tempo em Dias:</label>
                        <input type="text" id="fluxoGatilho" placeholder="Dias para o Disparo do Remarketing">
                        <button id="confirmarAdicaoRmkt">Confirmar Remarketing</button>
                    </div>
                    <div id="response"></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalContent);
            document.getElementById('closeModal').addEventListener('click', function() {
                document.getElementById('addFluxoModalBackdrop').remove();
            });
            document.getElementById('confirmarAdicaoRmkt').addEventListener('click', function() {
                const urlFluxo = document.getElementById('fluxoUrl').value;
                const nomeFluxo = document.getElementById('fluxoNome').value;
                const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
                ws.send(JSON.stringify({
                    action: 'confirmarAdicaoRmkt',
                    data: {
                        url: urlFluxo,
                        nome: nomeFluxo,
                        dias: gatilhoFluxo
                    }
                }));
                alert('Remarketing adicionado com sucesso!');
                ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
                document.getElementById('addFluxoModalBackdrop').remove();
            });
        }

        let targetElement = event.target;
        if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxo') {
            targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoRapida') {
            targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoRmkt') {
            targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoGrupo') {
            targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'iniciarCampanha') {
            targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'pararCampanha') {
            targetElement = targetElement.parentNode;
        }

        if (targetElement.classList == 'deleteFluxo') {
            const fluxoNome = targetElement.getAttribute('data-fluxoNome');
            ws.send(JSON.stringify({
                action: 'excluirFluxo',
                data: { nome: fluxoNome }
            }));
            alert('Fluxo excluido com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarLista' }));
        } else if (targetElement.classList == 'deleteFluxoRapida') {
            const fluxoNome = targetElement.getAttribute('data-fluxoNome');
            ws.send(JSON.stringify({
                action: 'excluirRapida',
                data: { nome: fluxoNome }
            }));
            alert('Resposta Rápida excluida com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
        } else if (targetElement.classList == 'deleteFluxoRmkt') {
            const fluxoNome = targetElement.getAttribute('data-fluxoNome');
            ws.send(JSON.stringify({
                action: 'excluirRmkt',
                data: { url: fluxoNome }
            }));
            alert('Remarketing excluido com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
        } else if (targetElement.classList == 'deleteFluxoGrupo') {
            const fluxoNome = targetElement.getAttribute('data-fluxoNome');
            ws.send(JSON.stringify({
                action: 'excluirGrupo',
                data: { name: fluxoNome }
            }));
            alert('Automação de Grupo excluida com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
        }
    });

    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        const responseDiv = document.getElementById('response');
        if (message.action) {
            switch (message.action) {
                case 'listaAtualizada':
                    renderFluxosList(message.data);
                    break;
                case 'excluirFluxo':
                    if (responseDiv) responseDiv.innerHTML = "Fluxo excluído com sucesso.";
                    responseDiv.style.color = 'green';
                    break;
                case 'listaRapidaAtualizada':
                    renderFluxosListRapida(message.data);
                    break;
                case 'excluirRapida':
                    if (responseDiv) responseDiv.innerHTML = "Resposta Rápida excluída com sucesso.";
                    responseDiv.style.color = 'green';
                    break;
                case 'listaRmktAtualizada':
                    renderFluxosRmkt(message.data);
                    break;
                case 'excluirRmkt':
                    if (responseDiv) responseDiv.innerHTML = "Remarketing excluído com sucesso.";
                    responseDiv.style.color = 'green';
                    break;
                case 'listaGrupoAtualizada':
                    renderFluxosGrupos(message.data);
                    break;
                case 'excluirGrupo':
                    if (responseDiv) responseDiv.innerHTML = "Grupo excluído com sucesso.";
                    responseDiv.style.color = 'green';
                    break;
                case 'listaLeadsAtualizada':
                    updateListaLeadsSelect(message.data);
                    break;
                case 'listaFluxosAtualizada':
                    updateFluxosSelect(message.data);
                    break;
                default:
                    if (responseDiv) {
                        responseDiv.innerHTML = message.message || "Ação realizada com sucesso!";
                        responseDiv.style.color = 'green';
                    }
                    break;
            }
        } else {
            if (responseDiv) {
                responseDiv.innerHTML = message.message || "Ação realizada com sucesso!";
                responseDiv.style.color = 'green';
            }
        }
    };

    function updateListaLeadsSelect(leads) {
        const listaLeadsSelect = document.getElementById('listaLeads');
        listaLeadsSelect.innerHTML = '';
        leads.forEach(lead => {
            const option = document.createElement('option');
            option.value = lead;
            option.textContent = lead.replace('.json', '');
            listaLeadsSelect.appendChild(option);
        });
    }

    function updateFluxosSelect(fluxos) {
        const fluxoSelecionadoSelect = document.getElementById('fluxoSelecionado');
        fluxoSelecionadoSelect.innerHTML = '';
        fluxos.forEach(fluxo => {
            const option = document.createElement('option');
            option.value = fluxo.name;
            option.textContent = fluxo.name;
            fluxoSelecionadoSelect.appendChild(option);
        });
    }

    function renderFluxosList(fluxos) {
        if (!fluxos) return;
        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="padding: 8px;">${fluxo.url_registro}</td>
                <td style="padding: 8px;">${fluxo.gatilho}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxo" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: black;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Fluxos</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>
                                <th style="text-align: center; padding: 8px;">URL</th>
                                <th style="text-align: center; padding: 8px;">Gatilho</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarLista" style="cursor: pointer;">Atualizar Lista</button>
                    <button id="adicionarFluxo" style="cursor: pointer;">Adicionar Fluxo</button>
                </div>
            </div>
        `;
        attachEventListeners();
    }

    function renderFluxosListRapida(fluxos) {
        if (!fluxos) return;
        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="padding: 8px;">${fluxo.gatilho}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoRapida" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: black;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Respostas Rápidas</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>
                                <th style="text-align: center; padding: 8px;">Frase de Disparo</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarListaRapida" style="cursor: pointer;">Atualizar Respostas Rápidas</button>
                    <button id="adicionarRespostaRapida" style="cursor: pointer;">Adicionar Resposta Rápida</button>
                </div>
            </div>
        `;
        attachEventListeners();
    }

    function renderFluxosRmkt(fluxos) {
        if (!fluxos) return;
        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.url_registro}</td>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="padding: 8px;">${fluxo.disparo}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoRmkt" data-fluxoNome="${fluxo.url_registro}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: black;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Remarketing</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">URL do Fluxo de Remarketing</th>
                                <th style="text-align: center; padding: 8px;">Nome do Fluxo Principal</th>
                                <th style="text-align: center; padding: 8px;">Dias para o disparo</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarListaRmkt" style="cursor: pointer;">Atualizar Fluxos de Remarketing</button>
                    <button id="adicionarRmkt" style="cursor: pointer;">Adicionar Remarketing</button>
                </div>
            </div>
        `;
        attachEventListeners();
    }

    function renderFluxosGrupos(fluxos) {
        if (!fluxos) return;
        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoGrupo" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: black;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Automação de Grupo</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">ID do Grupo em Atividade</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarGrupo" style="cursor: pointer;">Atualizar Grupos Ativos</button>
                </div>
            </div>
        `;
        attachEventListeners();
    }

    function attachEventListeners() {
        const updateListBtn = document.getElementById('atualizarLista');
        if (updateListBtn) {
            updateListBtn.addEventListener('click', function() {
                ws.send(JSON.stringify({
                    action: 'atualizarLista'
                }));
            });
        }

        const updateListRapidaBtn = document.getElementById('atualizarListaRapida');
        if (updateListRapidaBtn) {
            updateListRapidaBtn.addEventListener('click', function() {
                ws.send(JSON.stringify({
                    action: 'atualizarListaRapida'
                }));
            });
        }

        const updateRmktBtn = document.getElementById('atualizarListaRmkt');
        if (updateRmktBtn) {
            updateRmktBtn.addEventListener('click', function() {
                ws.send(JSON.stringify({
                    action: 'atualizarListaRmkt'
                }));
            });
        }

        const updateGrupoBtn = document.getElementById('atualizarGrupo');
        if (updateGrupoBtn) {
            updateGrupoBtn.addEventListener('click', function() {
                ws.send(JSON.stringify({
                    action: 'atualizarGrupo'
                }));
            });
        }

        const uploadButton = document.getElementById('uploadButton');
        if (uploadButton) {
            uploadButton.addEventListener('click', function() {
                const fileInput = document.getElementById('fileInput');
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        ws.send(JSON.stringify({
                            action: 'uploadLeads',
                            fileName: file.name,
                            data: content
                        }));
                    };
                    reader.readAsText(file);
                    alert('Arquivo de leads enviado com sucesso!');
                } else {
                    alert('Por favor, selecione um arquivo JSON para carregar.');
                }
            });
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const fileName = this.files && this.files.length > 0 ? this.files[0].name : 'Nenhum arquivo selecionado';
                document.getElementById('fileUploadText').innerText = fileName;
            });
        }

        const uploadButtonMidia = document.getElementById('uploadButtonMidia');
        if (uploadButtonMidia) {
            uploadButtonMidia.addEventListener('click', function() {
                const fileInputMidia = document.getElementById('fileInputMidia');
                const fileMidia = fileInputMidia.files[0];
                if (fileMidia) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        ws.send(JSON.stringify({
                            action: 'uploadMedia',
                            fileName: fileMidia.name,
                            data: content
                        }));
                    };
                    reader.readAsDataURL(fileMidia);
                    alert('Arquivo de mídia enviado com sucesso!');
                } else {
                    alert('Por favor, selecione um arquivo de mídia para carregar.');
                }
            });
        }

        const fileInputMidia = document.getElementById('fileInputMidia');
        if (fileInputMidia) {
            fileInputMidia.addEventListener('change', function() {
                const fileNameMidia = this.files && this.files.length > 0 ? this.files[0].name : 'Nenhum arquivo selecionado';
                document.getElementById('fileUploadTextMidia').innerText = fileNameMidia;
            });
        }

        const iniciarCampanhaBtn = document.getElementById('iniciarCampanha');
        if (iniciarCampanhaBtn) {
            iniciarCampanhaBtn.addEventListener('click', function() {
                const listaLeadsSelect = document.getElementById('listaLeads');
                const minDelayInput = document.getElementById('minDelay');
                const maxDelayInput = document.getElementById('maxDelay');
                const startPositionInput = document.getElementById('startPosition');
                const endPositionInput = document.getElementById('endPosition');
                const fluxoSelecionadoSelect = document.getElementById('fluxoSelecionado');

                const listaleads = listaLeadsSelect.value;
                const minDelay = minDelayInput.value;
                const maxDelay = maxDelayInput.value;
                const startPosition = startPositionInput.value;
                const endPosition = endPositionInput.value;
                const fluxoSelecionado = fluxoSelecionadoSelect.value;

                if (!listaleads || !minDelay || !maxDelay || !startPosition || !endPosition || !fluxoSelecionado) {
                    alert('Por favor, preencha todos os campos antes de iniciar a campanha.');
                    return;
                }

                if (parseInt(minDelay, 10) >= parseInt(maxDelay, 10)) {
                    alert('O Delay Mínimo deve ser menor que o Delay Máximo.');
                    return;
                }

                if (parseInt(startPosition, 10) >= parseInt(endPosition, 10)) {
                    alert('A Posição Inicial deve ser menor que a Posição Final.');
                    return;
                }

                ws.send(JSON.stringify({
                    action: 'iniciarCampanha',
                    data: {
                        listaleads: listaleads,
                        minDelay: parseInt(minDelay, 10),
                        maxDelay: parseInt(maxDelay, 10),
                        startPosition: parseInt(startPosition, 10),
                        endPosition: parseInt(endPosition, 10),
                        fluxoSelecionado: fluxoSelecionado
                    }
                }));
                alert('Campanha de disparo iniciada!');
            });
        }

        const pararCampanhaBtn = document.getElementById('pararCampanha');
        if (pararCampanhaBtn) {
            pararCampanhaBtn.addEventListener('click', function() {
                ws.send(JSON.stringify({
                    action: 'pararCampanha'
                }));
                alert('Campanha de disparo cancelada!');
            });
        }
    }

    document.addEventListener('DOMContentLoaded', attachEventListeners);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = link.textContent.trim();

            if (sectionName === "Gerenciar Instâncias") {
                mainContent.innerHTML = `
                    <div id="ativarTypeZap">
                        <h2>Cadastrar Instância</h2>
                        <p>Insira as informações necessárias para cadastrar uma Instância Evolution.</p>
                        <label for="urlField">URL do JohnnyZap:</label>
                        <input type="text" id="urlField" placeholder="http://seu_ip:3002/api/v1/sessions/">
                        <small>Endereço URL para conectar o JohnnyZap.</small><br>
                        
                        <label for="instanciaNome">Nome da Instância Evolution:</label>
                        <input type="text" id="instanciaNome" placeholder="Nome da sua instância Evolution">
                        <small>Nome da sua instância Evolution.</small><br>
            
                        <label for="instanciaChave">Chave da Instância Evolution:</label>
                        <input type="text" id="instanciaChave" placeholder="Chave da sua instância Evolution">
                        <small>Chave da API da sua instância Evolution para autenticação.</small><br>
            
                        <label for="openAIKey">Chave OpenAI (Apenas para JohnnyZap AI):</label>
                        <input type="text" id="openAIKey" placeholder="Sua chave OpenAI">
                        <small>Chave de API da OpenAI para autenticação.</small><br>
            
                        <label for="elevenLabsKey">Chave ElevenLabs (Apenas para JohnnyZap AI):</label>
                        <input type="text" id="elevenLabsKey" placeholder="Sua chave ElevenLabs">
                        <small>Chave de API da ElevenLabs para autenticação.</small><br>
            
                        <button id="registerTypeZap">Cadastrar Instância</button>
                        <div id="response" style="margin-top: 20px;"></div>
                    </div>
                `;
                document.getElementById('registerTypeZap').addEventListener('click', function() {
                    const url = document.getElementById('urlField').value;
                    const instanciaNome = document.getElementById('instanciaNome').value;
                    const instanciaChave = document.getElementById('instanciaChave').value;
                    const openAIKey = document.getElementById('openAIKey').value;
                    const elevenLabsKey = document.getElementById('elevenLabsKey').value;                    
                    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
                        alert('A URL deve começar com "http://" ou "https://".');
                        return;
                    } 
                    if (!url.endsWith('/sessions/')) {
                        alert('A URL deve terminar com "/sessions/".');
                        return;
                    }
                    if (instanciaNome.trim() === '') {
                        alert('O nome da instância Evolution é obrigatório.');
                        return;
                    }
                    if (instanciaChave.trim() === '') {
                        alert('A chave da instância Evolution é obrigatória.');
                        return;
                    }
                    alert('Instância Evolution foi registrada com sucesso!');
                    ws.send(JSON.stringify({
                        action: 'registerTypeZap',
                        data: {
                            url: url,
                            instanciaNome: instanciaNome,
                            instanciaChave: instanciaChave,
                            openAIKey: openAIKey,
                            elevenLabsKey: elevenLabsKey
                        }
                    }));
                });
            } else if (sectionName === "Gerenciar Fluxos") {
                mainContent.innerHTML = `
                    <div id="fluxosWrapper">
                        <h2>Gerenciar Fluxos</h2>
                        <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #007bff; color: white;">
                                        <th style="text-align: center; padding: 8px;">Nome</th>
                                        <th style="text-align: center; padding: 8px;">URL</th>
                                        <th style="text-align: center; padding: 8px;">Gatilho</th>
                                        <th style="text-align: center; padding: 8px;">Ação</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style="margin-top: 20px;">
                            <button id="atualizarLista" style="cursor: pointer;">Atualizar Lista</button>
                            <button id="adicionarFluxo" style="cursor: pointer;">Adicionar Fluxo</button>
                        </div>
                    </div>
                `;
                attachEventListeners();
                ws.send(JSON.stringify({ action: 'atualizarLista' }));
            } else if (sectionName === "Gerenciar Respostas Rápidas") {
                mainContent.innerHTML = `
                    <div id="fluxosWrapper">
                        <h2>Gerenciar Respostas Rápidas</h2>
                        <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #007bff; color: white;">
                                        <th style="text-align: center; padding: 8px;">Nome</th>
                                        <th style="text-align: center; padding: 8px;">Frase de Disparo</th>
                                        <th style="text-align: center; padding: 8px;">Ação</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style="margin-top: 20px;">
                            <button id="atualizarListaRapida" style="cursor: pointer;">Atualizar Respostas Rápidas</button>
                            <button id="adicionarRespostaRapida" style="cursor: pointer;">Adicionar Resposta Rápida</button>
                        </div>
                    </div>
                `;
                attachEventListeners();
                ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
            } else if (sectionName === "Gerenciar Remarketing") {
                mainContent.innerHTML = `
                    <div id="fluxosWrapper">
                        <h2>Gerenciar Remarketing</h2>
                        <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #007bff; color: white;">
                                        <th style="text-align: center; padding: 8px;">URL do Fluxo de Remarketing</th>
                                        <th style="text-align: center; padding: 8px;">Nome do Fluxo Principal</th>
                                        <th style="text-align: center; padding: 8px;">Dias para o disparo</th>
                                        <th style="text-align: center; padding: 8px;">Ação</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style="margin-top: 20px;">
                            <button id="atualizarListaRmkt" style="cursor: pointer;">Atualizar Fluxos de Remarketing</button>
                            <button id="adicionarRmkt" style="cursor: pointer;">Adicionar Remarketing</button>
                        </div>
                    </div>
                `;
                attachEventListeners();
                ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
            } else if (sectionName === "Gerenciar Automação de Grupo") {
                mainContent.innerHTML = `
                    <div id="fluxosWrapper">
                        <h2>Gerenciar Automação de Grupo</h2>
                        <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #007bff; color: white;">
                                        <th style="text-align: center; padding: 8px;">ID do Grupo em Atividade</th>
                                        <th style="text-align: center; padding: 8px;">Ação</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style="margin-top: 20px;">
                            <button id="atualizarGrupo" style="cursor: pointer;">Atualizar Grupos Ativos</button>
                        </div>
                    </div>
                `;
                attachEventListeners();
                ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
            } else if (sectionName === "Carregar Lista de Leads") {
                mainContent.innerHTML = `
                    <div id="carregarLeads">
                        <h2>Carregar Lista de Leads</h2>
                        <div class="file-upload-wrapper">
                            <input type="file" id="fileInput" class="file-upload-input" accept=".json">
                            <label for="fileInput" class="file-upload-button">Selecione o Arquivo</label>
                            <div id="fileUploadText" class="file-upload-text">Nenhum arquivo selecionado</div>
                        </div>
                        <button id="uploadButton">Enviar Lista</button>
                    </div>
                `;
                attachEventListeners();
            } else if (sectionName === "Carregar Arquivo de Mídia") {
                mainContent.innerHTML = `
                    <div id="carregarArquivoMidia">
                        <h2>Carregar Arquivo de Mídia</h2>
                        <div class="file-upload-wrapper">
                            <input type="file" id="fileInputMidia" class="file-upload-input" accept="image/*, audio/*, application/pdf">
                            <label for="fileInputMidia" class="file-upload-button">Selecione o Arquivo</label>
                            <div id="fileUploadTextMidia" class="file-upload-text">Nenhum arquivo selecionado</div>
                        </div>
                        <button id="uploadButtonMidia">Enviar Midia</button>
                    </div>
                `;
                attachEventListeners();
            } else if (sectionName === "Disparo de Mensagens em Massa") {
                mainContent.innerHTML = `
                    <div id="massMessageDispatch">
                        <h2>Disparo de Mensagens em Massa</h2>
                        <label for="listaLeads">Selecione a Lista de Leads:</label>
                        <select id="listaLeads">
                            <option value="contatos1.json">Lista de Contatos 1</option>
                            <option value="contatos2.json">Lista de Contatos 2</option>
                        </select>
                        <div class="input-group input-group-inline">
                            <div>
                                <label for="minDelay">Delay Mínimo (segundos):</label>
                                <input type="number" id="minDelay" placeholder="Min">
                            </div>
                            <div>
                                <label for="maxDelay">Delay Máximo (segundos):</label>
                                <input type="number" id="maxDelay" placeholder="Max">
                            </div>
                        </div>
                        <div class="input-group input-group-inline">
                            <div>
                                <label for="startPosition">Posição Inicial:</label>
                                <input type="number" id="startPosition" placeholder="Início">
                            </div>
                            <div>
                                <label for="endPosition">Posição Final:</label>
                                <input type="number" id="endPosition" placeholder="Fim">
                            </div>
                        </div>
                        <label for="fluxoSelecionado">Selecione o Fluxo:</label>
                        <select id="fluxoSelecionado">
                            <option value="fluxoVendas">Fluxo de Vendas</option>
                            <option value="fluxoSuporte">Fluxo de Suporte</option>
                        </select>
                        <div class="buttons-group">
                            <button id="iniciarCampanha">Iniciar Campanha</button>
                            <button id="pararCampanha">Parar Campanha</button>
                        </div>
                        <div id="campaignStatus" class="campaign-status">Status da Campanha: Aguardando ação...</div>
                    </div>
                `;
                ws.send(JSON.stringify({ action: 'atualizarListaLeads' }));
                ws.send(JSON.stringify({ action: 'atualizarListaFluxos' }));
                attachEventListeners();
            }
        });
    });
});
