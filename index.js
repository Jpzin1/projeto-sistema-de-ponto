/////////////////////////// Funções de Geolocalização e Registro ///////////////////////////

// Transformar a função getUserLocation em uma função assíncrona
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let userLocation = {
                    "lat": position.coords.latitude,
                    "long": position.coords.longitude
                };
                console.log("Localização do usuário obtida:", userLocation);
                resolve(userLocation);
            },
            (error) => {
                console.error("Erro ao obter a localização:", error);
                reject(error);
            }
        );
    });
}

// Função para criar o objeto de registro
async function getObjectRegister(registerType) {
    try {
        console.log("Obtendo localização do usuário...");
        const location = await getUserLocation();
        console.log("Localização obtida:", location);

        const validTypes = ['entrada', 'saida', 'intervalo', 'volta-intervalo'];
        if (!validTypes.includes(registerType)) {
            throw new Error(`Tipo de registro inválido: ${registerType}`);
        }

        const justificativaInput = document.getElementById("justificativa-select");
        const justificativa = justificativaInput ? justificativaInput.value.trim() : null;

        // Obtendo arquivos anexados
        const fileInput = document.getElementById("file-upload");
        let comprovantes = [];
        if (fileInput && fileInput.files.length > 0) {
            const filePromises = Array.from(fileInput.files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const blob = new Blob([e.target.result], { type: file.type });
                        const url = URL.createObjectURL(blob);
                        resolve({ url: url, name: file.name }); 
                    };
                    reader.onerror = (error) => {
                        console.error("Erro ao ler o arquivo:", error);
                        reject(error);
                    };
                    reader.readAsArrayBuffer(file); 
                });
            });
            comprovantes = await Promise.all(filePromises); 
        }

        let ponto = {
            "date": getCurrentDate(),
            "time": getCurrentTime(),
            "location": location,
            "id": Date.now(),
            "type": registerType,
            "justificativa": justificativa,
            "comprovantes": comprovantes 
        };

        console.log(`Registro criado: 
            Data: ${ponto.date}, 
            Hora: ${ponto.time}, 
            Localização: Lat: ${ponto.location.lat}, Long: ${ponto.location.long}, 
            Tipo: ${ponto.type}, 
            Justificativa: ${ponto.justificativa}, 
            Comprovantes: ${ponto.comprovantes.map(c => c.name).join(', ')}, 
            ID: ${ponto.id}`);

        return ponto;
    } catch (error) {
        console.error("Erro ao criar o registro:", error);
    }
}


// Função para salvar o registro no LocalStorage
function saveRegisterLocalStorage(register) {
    let registros = JSON.parse(localStorage.getItem("registers")) || [];
    registros.push(register);
    localStorage.setItem("registers", JSON.stringify(registros));
    console.log("Registro salvo no localStorage:", register);
}

// Função para obter os registros salvos
function getRegisterLocalStorage() {
    const registros = JSON.parse(localStorage.getItem("registers")) || [];
    console.log("Registros recuperados do localStorage:", registros);
    return registros;
}

/////////////////////////// Ações dos Botões de Registro ///////////////////////////

// Botão de registro de ponto
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", () => {
    const dialogPonto = document.getElementById("dialog-ponto");
    dialogPonto.showModal();
    updateContentHour();
});

// Botão para fechar o dialog
const btnDialogFechar = document.getElementById("dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    const dialogPonto = document.getElementById("dialog-ponto");
    dialogPonto.close();
});

// Fechar o dialog ao pressionar "Esc"
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const dialogPonto = document.getElementById("dialog-ponto");
        dialogPonto.close();
    }
});

// Ação para o botão funcionar (botão registrar ponto (fechar))
document.addEventListener('DOMContentLoaded', () => {
    const dialogPonto = document.getElementById('dialog-ponto');
    const btnDialogExit = document.getElementById('btn-dialog-exit');

    btnDialogExit.addEventListener('click', () => {
        dialogPonto.close(); 
    });
});


/////////////////////////// Dialog e Atualização de Conteúdo ///////////////////////////

function updateContentHour() {
    const dialogDate = document.getElementById("dialog-data");
    const dialogTime = document.getElementById("dialog-hora");
    document.getElementById("dia-semana").textContent = getWeekDay();
    document.getElementById("data-atual").textContent = getCurrentDate();
    document.getElementById("hora-atual").textContent = getCurrentTime();
    
    if (dialogDate) {
        dialogDate.textContent = getCurrentDate();
    }
    if (dialogTime) {
        dialogTime.textContent = getCurrentTime();
    }
}

// Retorna a hora atual (hora/minuto/segundo)
function getCurrentTime() {
    const date = new Date();
    let horas = (date.getHours() < 10 ? '0' : '') + date.getHours();
    let minutos = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let segundos = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    return horas + ":" + minutos + ":" + segundos;
}

// Retorna a data atual no padrão dd/mm/aaaa
function getCurrentDate() {
    const date = new Date();
    let mes = ((date.getMonth() + 1) < 10 ? '0' : '')  + (date.getMonth() + 1);
    let data = (date.getDate() < 10 ? '0' : '') + date.getDate();
    let ano = date.getFullYear();
    return data + "/" + mes + "/" + ano;
}

// Retorna o dia da semana
function getWeekDay() {
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const d = new Date();
    return diasSemana[d.getDay()];
}

setInterval(updateContentHour, 1000);

/////////////////////////// Manipulação do Tipo de Registro ///////////////////////////

const selectRegisterType = document.getElementById("dialog-select");

function setRegisterType() {
    const lastRegisterType = localStorage.getItem("lastRegisterType") || 'entrada'; 
    const tipoRegistroMap = {
        'entrada': 'intervalo',
        'intervalo': 'volta-intervalo',
        'volta-intervalo': 'saida',
        'saida': 'entrada'
    };

    const proximoTipo = tipoRegistroMap[lastRegisterType] || 'entrada'; 
    if (selectRegisterType) {
        selectRegisterType.value = proximoTipo;
    }

    console.log("Tipo de registro atualizado para:", proximoTipo); 
}

document.addEventListener('DOMContentLoaded', () => {
    setRegisterType();
});

/////////////////////////// Função para Mostrar Mensagens ///////////////////////////

function showMessage(message, isSuccess) {
    console.log("Mostrar mensagem:", message); 
    const messageElement = document.getElementById("message");
    const closeMessage = document.getElementById("close-message");

    if (messageElement) {
        const messageContent = document.getElementById("message-content");
        if (messageContent) {
            messageContent.textContent = message;
        }

        messageElement.classList.toggle("sucesso", isSuccess);
        messageElement.classList.toggle("error", !isSuccess);

        messageElement.style.display = 'flex'; 

        if (closeMessage) {
            closeMessage.addEventListener("click", () => {
                messageElement.style.display = 'none';
            });
        }

        setTimeout(() => {
            messageElement.style.display = 'none'; 
        }, 3000);
    } else {
        console.error("Elemento de mensagem não encontrado.");
    }
}

/////////////////////////// Função para Atualizar a Tabela de Histórico ///////////////////////////

// Função para atualizar a tabela de histórico
function updateHistoricoTable() {
    const tabelaHistorico = document.getElementById('historico-table').getElementsByTagName('tbody')[0];
    tabelaHistorico.innerHTML = '';

    const registros = getRegisterLocalStorage();
    registros.forEach((registro) => {
        const novaLinha = tabelaHistorico.insertRow();
        
        const celulaData = novaLinha.insertCell();
        celulaData.textContent = registro.date;
        
        const celulaHora = novaLinha.insertCell();
        celulaHora.textContent = registro.time;
        
        const celulaTipo = novaLinha.insertCell();
        celulaTipo.textContent = registro.type;

        const celulaJustificativa = novaLinha.insertCell();
        celulaJustificativa.textContent = registro.justificativa ? registro.justificativa : 'N/A'; 

        const celulaComprovantes = novaLinha.insertCell();
        if (registro.comprovantes && registro.comprovantes.length > 0) {
            registro.comprovantes.forEach(comprovante => {
                const link = document.createElement('a');
                link.href = comprovante.url; 
                link.textContent = comprovante.name; // Usando o nome do arquivo como texto do link
                
                // Remove a abertura do link em nova aba
                celulaComprovantes.appendChild(link);
                celulaComprovantes.appendChild(document.createElement('br'));
            });
        } else {
            celulaComprovantes.textContent = 'N/A';
        }
    });
}

const btnHistorico = document.getElementById("btn-historico");
btnHistorico.addEventListener("click", () => {
    const dialogHistorico = document.getElementById("dialog-historico");
    if (dialogHistorico) {
        dialogHistorico.showModal();
        updateHistoricoTable(); 
    } else {
        console.error("Dialog Histórico não encontrado.");
    }
});

const btnFecharHistorico = document.getElementById("btn-fechar-historico");
btnFecharHistorico.addEventListener("click", () => {
    const dialogHistorico = document.getElementById("dialog-historico");
    if (dialogHistorico) {
        dialogHistorico.close();
    } else {
        console.error("Dialog Histórico não encontrado.");
    }
});

const btnLimparHistorico = document.getElementById("btn-limpar-historico");

if (btnLimparHistorico) {
    btnLimparHistorico.addEventListener("click", () => {
        localStorage.removeItem("registers");
        updateHistoricoTable();
        showMessage("Histórico limpo com sucesso!", true);
    });
} else {
    console.error("Botão de limpar histórico não encontrado.");
}

/////////////////////////// Evento de Clique no Botão Registrar ///////////////////////////

const btnDialogRegister = document.getElementById("btn-dialog-register");
if (btnDialogRegister) {
    btnDialogRegister.addEventListener("click", async () => {
        const registerType = selectRegisterType ? selectRegisterType.value : 'entrada'; 
        const registro = await getObjectRegister(registerType);
        if (registro) {
            saveRegisterLocalStorage(registro);
            localStorage.setItem("lastRegisterType", registerType); 
            setRegisterType(); 
            document.getElementById("dialog-ponto").close(); 
            showMessage("Registro salvo com sucesso!", true); 
        } else {
            showMessage("Erro ao salvar o registro!", false); 
        }
    });
} else {
    console.error("Botão de registro não encontrado.");
}

/////////////////////////// Link para abrir a outra pagina ///////////////////////////

const btnVerInfo = document.getElementById("btn-ver-info");

if (btnVerInfo) {
    btnVerInfo.addEventListener("click", () => {
        
        window.location.href = "info.html"; 
    });
} else {
    console.error("Botão 'Mais informações' não encontrado.");
}

