// Obtém os elementos de cor e botões
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");
const salvarCoresBtn = document.getElementById("salvarCores");
const habilitarBtn = document.getElementById("habilitar");
const desabilitarBtn = document.getElementById("desabilitar");

// Função para recarregar a aba do YouTube
function recarregarYoutube() {
    // Consulta as abas ativas no YouTube
    chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
        // Recarrega a primeira aba encontrada do YouTube
        if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

// Evento ao clicar no botão "Salvar Cores"
salvarCoresBtn.addEventListener("click", function() {
    // Obtém as cores selecionadas
    const color1 = color1Input.value;
    const color2 = color2Input.value;

    // Armazena as cores no armazenamento local
    chrome.storage.local.set({ color1: color1, color2: color2 }, function() {
        console.log("Cores salvas:", color1, color2); // Verifica se as cores estão sendo salvas
        recarregarYoutube(); // Recarrega o YouTube após salvar
		 setTimeout(fecharPopup, 100);  // Aguarda para garantir que as operações terminem
    });
});

// Evento ao clicar no botão "Habilitar Alteração"
habilitarBtn.addEventListener("click", function() {
    chrome.storage.local.set({ alterarHabilitado: true }, function() {
        console.log("Alteração habilitada");
        recarregarYoutube(); // Recarrega o YouTube após habilitar
		 setTimeout(fecharPopup, 100);  // Aguarda para garantir que as operações terminem
    });
});

// Evento ao clicar no botão "Desabilitar Alteração"
desabilitarBtn.addEventListener("click", function() {
    chrome.storage.local.set({ alterarHabilitado: false }, function() {
        console.log("Alteração desabilitada");
        recarregarYoutube(); // Recarrega o YouTube após desabilitar
		 setTimeout(fecharPopup, 100);  // Aguarda para garantir que as operações terminem
    });
});

// Função para carregar as cores salvas nos inputs de cor
function carregarCoresSalvas() {
    // Recupera as cores salvas no armazenamento local
    chrome.storage.local.get(['color1', 'color2'], function(result) {
        if (result.color1) {
            color1Input.value = result.color1; // Define a cor 1 salva no input
        }
        if (result.color2) {
            color2Input.value = result.color2; // Define a cor 2 salva no input
        }
    });
}

// Verifica o estado de habilitação/desabilitação ao carregar
chrome.storage.local.get(['alterarHabilitado'], function(result) {
    if (result.alterarHabilitado === false) {
        desabilitarBtn.disabled = true;
        habilitarBtn.disabled = false;
    } else {
        desabilitarBtn.disabled = false;
        habilitarBtn.disabled = true;
    }
});

// Função para fechar o popup da extensão
function fecharPopup() {
    // Verifica se o popup é uma aba de extensão
    chrome.runtime.getPlatformInfo(function(info) {
        if (info.os === 'chrome_os' || info.os === 'mac' || info.os === 'win' || info.os === 'linux') {
            // Fecha a aba do popup da extensão
            window.close();
        }
    });
}

// Chama a função para carregar as cores salvas ao abrir o popup
carregarCoresSalvas();