var modal = document.getElementById("modal");
var btn = document.getElementById("btn-registrar-ponto");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onkeydown = function (event) {
    if (event.key == "Escape") {
        modal.style.display = "none";
    }
}

const diasSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

btnRegistrarPonto.addEventListener("click", register);


function register() {
    alert("Bater ponto!");
}


function updateContentHour() {
    dataAtual.textContent =  getCurrentDate();
    horaAtual.textContent = getCurrentTime();
    diasSemana.textContent = getWeekDay();
}


// retorna a hora atual (hora/minuto/segundo)
function getCurrentTime() {
    
    const date = new Date();

    let horas = (date.getHours() < 10 ? '0' : '') + date.getHours();
    let minutos = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let segundos = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    return horas + ":" + minutos + ":" + segundos;
}

//Retorna a data atual no padrão dd/aa/aaaa
function getCurrentDate() {

    const date = new Date();

    let mes = ((date.getMonth() + 1) < 10 ? '0' : '')  + (date.getMonth() + 1);
    let data = (date.getDate() < 10 ? '0' : '') + date.getDate();
    let ano = (date.getFullYear() < 10 ? '0' : '') + date.getFullYear();

    return data + "/" + mes + "/" + ano;
}

// Retorna o dia da semana 
function getWeekDay() {
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const d = new Date();
    return diasSemana[d.getDay()];
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getWeekDay());
console.log(getCurrentTime());
console.log(getCurrentDate());