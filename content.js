// Função para aplicar as cores a todos os elementos encontrados
function aplicarCores() {
    // Seleciona todos os elementos com a classe .ytp-swatch-background-color
    var swatchBackgrounds = document.querySelectorAll(".ytp-swatch-background-color");
    var scrubberButtons = document.querySelectorAll(".ytp-scrubber-button");

    // Obtem as cores do armazenamento local
    chrome.storage.local.get(['color1', 'color2', 'alterarHabilitado'], function(result) {
        if (chrome.runtime.lastError) {
            console.error("Erro ao acessar chrome.storage:", chrome.runtime.lastError);
            return;
        }

        console.log("Cores recuperadas:", result.color1, result.color2); // Verifica se as cores são recuperadas corretamente

        // Se a alteração estiver habilitada, aplica as cores
        if (result.alterarHabilitado !== false) {
            const color1 = result.color1 || '#0062FF'; // Cor padrão se não houver valor
            const color2 = result.color2 || '#4100F5'; // Cor padrão se não houver valor

            // Aplica as cores em todos os elementos com a classe .ytp-swatch-background-color
            swatchBackgrounds.forEach(function(swatchBackground) {
                swatchBackground.style.background = `linear-gradient(to right, ${color1} 50%, ${color2} 100%)`;
                swatchBackground.style.backgroundColor = ""; // Remove o background-color
            });

            // Aplica a cor ao background de todos os elementos com a classe .ytp-scrubber-button
            scrubberButtons.forEach(function(scrubberButton) {
                scrubberButton.style.backgroundColor = `${color2}`; // Define o background-color
            });
        } else {
            console.log("Alteração de cor está desabilitada.");
        }
    });
}

// Função para observar mudanças no DOM
function observarMudancasNoDOM() {
    // Configuração do observer para observar adições de novos nós
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // Quando um novo nó for adicionado ao DOM, aplica as cores novamente
                aplicarCores();
            }
        }
    });

    // Inicia o observer no body, observando adições de novos nós
    observer.observe(document.body, { childList: true, subtree: true });
}

// Chama a função para aplicar as cores imediatamente
aplicarCores();

// Inicia a observação de mudanças no DOM
observarMudancasNoDOM();
