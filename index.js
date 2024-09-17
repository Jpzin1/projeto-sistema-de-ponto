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
                console.log("Localização do usuário obtida:", userLocation); // Log para verificar a localização
                resolve(userLocation); // Retornar a localização
            },
            (error) => {
                console.error("Erro ao obter a localização:", error); // Lidar com o erro
                reject(error); // Rejeitar a Promise
            }
        );
    });
}

// Função para criar o objeto de registro
async function getObjectRegister(registerType) {
    try {
        console.log("Obtendo localização do usuário...");
        const location = await getUserLocation(); // Espera a localização do usuário
        console.log("Localização obtida:", location); // Adicione log aqui

        // Verifique se o tipo de registro é válido
        const validTypes = ['entrada', 'saida', 'intervalo', 'volta-intervalo'];
        if (!validTypes.includes(registerType)) {
            throw new Error(`Tipo de registro inválido: ${registerType}`);
        }

        let ponto = {
            "date": getCurrentDate(),
            "time": getCurrentTime(),
            "location": location,  // Agora está pegando a localização correta
            "id": 1,  // Ajustar o ID conforme necessário
            "type": registerType
        };

        // Log detalhado incluindo tipo de registro
        console.log(`Registro criado: 
            Data: ${ponto.date}, 
            Hora: ${ponto.time}, 
            Localização: Lat: ${ponto.location.lat}, Long: ${ponto.location.long}, 
            Tipo: ${ponto.type}, 
            ID: ${ponto.id}`);

        return ponto;
    } catch (error) {
        console.error("Erro ao criar o registro:", error);
    }
}

// Função para salvar o registro no LocalStorage
function saveRegisterLocalStorage(register) {
    let registros = JSON.parse(localStorage.getItem("registers")) || []; // Recupera os registros existentes
    registros.push(register); // Adiciona o novo registro
    localStorage.setItem("registers", JSON.stringify(registros)); // Salva o array atualizado
    console.log("Registro salvo no localStorage:", register); // Log confirmando o salvamento
}

// Função para obter os registros salvos
function getRegisterLocalStorage() {
    const registros = JSON.parse(localStorage.getItem("registers")) || [];
    console.log("Registros recuperados do localStorage:", registros); // Log dos registros
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
    dialogPonto.close(); // Fecha o dialog
});

// Fechar o dialog ao pressionar "Esc"
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const dialogPonto = document.getElementById("dialog-ponto");
        dialogPonto.close();
    }
});

/////////////////////////// Dialog e Atualização de Conteúdo ///////////////////////////

// Atualiza o conteúdo do dialog com data e hora
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

// Atualiza o conteúdo do dialog a cada segundo
setInterval(updateContentHour, 1000);

/////////////////////////// Manipulação do Tipo de Registro ///////////////////////////

// Seleção do tipo de registro
const selectRegisterType = document.getElementById("dialog-select");

// Selecionar o provável tipo do próximo registro
function setRegisterType() {
    const lastRegisterType = localStorage.getItem("lastRegisterType") || 'entrada'; // Valor padrão se não houver tipo de registro
    const tipoRegistroMap = {
        'entrada': 'intervalo',
        'intervalo': 'volta-intervalo',
        'volta-intervalo': 'saida',
        'saida': 'entrada'
    };

    const proximoTipo = tipoRegistroMap[lastRegisterType] || 'entrada'; // Valor padrão 'entrada' se não houver mapeamento
    if (selectRegisterType) {
        selectRegisterType.value = proximoTipo;
    }

    console.log("Tipo de registro atualizado para:", proximoTipo); // Log para verificar o valor atualizado
}

// Atualiza o valor do select quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    setRegisterType();
});

/////////////////////////// Função para Mostrar Mensagens ///////////////////////////

// Função para mostrar mensagens
function showMessage(message, isSuccess) {
    console.log("Mostrar mensagem:", message); // Adicione este log para verificar se a função é chamada
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block'; // Torna a mensagem visível

        setTimeout(() => {
            messageElement.style.display = 'none'; // Esconde após 3 segundos
        }, 5000);
    } else {
        console.error("Elemento de mensagem não encontrado.");
    }
}

/////////////////////////// Ação do Botão de Registro ///////////////////////////

// Botão para salvar o registro selecionado
const btnDialogRegister = document.getElementById("btn-dialog-register");

if (btnDialogRegister) {
    btnDialogRegister.addEventListener("click", async () => {
        const registerType = selectRegisterType ? selectRegisterType.value : 'entrada'; // Valor padrão se não houver selectRegisterType
        const registro = await getObjectRegister(registerType);
        if (registro) {
            saveRegisterLocalStorage(registro);
            localStorage.setItem("lastRegisterType", registerType); // Salva o último tipo de registro
            setRegisterType(); // Atualiza o tipo de registro para o próximo
            document.getElementById("dialog-ponto").close(); // Fecha o dialog
            showMessage("Registro salvo com sucesso!", true); // Mostrar mensagem de sucesso
        } else {
            showMessage("Erro ao salvar o registro!", false); // Mostrar mensagem de erro
        }
    });
} else {
    console.error("Botão de registro não encontrado.");
}
