navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
});

var modal = document.getElementById("modal");
var btn = document.getElementById("btn-registrar-ponto");
var span = document.getElementsByClassName("close")[0];
var btnEntrada = document.getElementById("btn-dialog-entrada");
var btnSaida = document.getElementById("btn-dialog-saida");

btn.onclick = function() {
    modal.style.display = "block";
    updateContentHour(); 
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onkeydown = function (event) {
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
}

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

// Atualiza o conteúdo do modal a cada segundo
setInterval(updateContentHour, 1000);
