///////////////////////////////////////////////////
// Construção para exibir o histórico com ações // 
// ///////////////////////////////////////////// //

document.addEventListener('DOMContentLoaded', () => {
    const historicoContainer = document.getElementById('historico-registros');

    function carregarHistorico() {
        const registros = JSON.parse(localStorage.getItem('registers')) || [];
        historicoContainer.innerHTML = ''; 

        if (registros.length === 0) {
            historicoContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
            return;
        }

        registros.forEach((registro, index) => {
            const registroDiv = document.createElement('div');
            registroDiv.classList.add('registro-item');
            
            registroDiv.innerHTML = `
                <p><strong>Data:</strong> ${registro.date}</p>
                <p><strong>Hora:</strong> ${registro.time}</p>
                <p><strong>Tipo:</strong> ${registro.type}</p>
                <p><strong>Justificativa:</strong> ${registro.justificativa || 'Nenhuma'}</p>
                <div>
                    <button class="btn-editar" data-index="${index}">Editar</button>
                    <button class="btn-excluir" data-index="${index}">Excluir</button>
                </div>
                <hr>
            `;

            historicoContainer.appendChild(registroDiv);
        });

        document.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', editarRegistro);
        });

        document.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', excluirRegistro);
        });
    }

    // Função para editar um registro
    function editarRegistro(event) {
        const index = event.target.getAttribute('data-index');
        const registros = JSON.parse(localStorage.getItem('registers')) || [];
        const registro = registros[index];

        
        // Editar a data
        const novaData = prompt("Edite a data do registro:", registro.date);
        if (novaData) {
            registro.date = novaData;
        }

        // Editar a hora
        const novaHora = prompt("Edite a hora do registro:", registro.time);
        if (novaHora) {
            registro.time = novaHora;
        }

        // Editar o tipo
        const novoTipo = prompt("Edite o tipo do registro:", registro.type);
        if(novoTipo) {
            registro.type = novoTipo;
        }

        // Editar a justificativa
        const novaJustificativa = prompt("Edite a justificativa do registro:", registro.justificativa);
        if (novaJustificativa) {
            registro.justificativa = novaJustificativa;
        }

        // Atualiza o registro no localStorage
        registros[index] = registro;
        localStorage.setItem('registers', JSON.stringify(registros));
        carregarHistorico(); // Recarrega o histórico após a edição
    }

    // Função para excluir um registro
    function excluirRegistro(event) {
        const index = event.target.getAttribute('data-index');
        let registros = JSON.parse(localStorage.getItem('registers')) || [];
        registros.splice(index, 1); 
        localStorage.setItem('registers', JSON.stringify(registros));
        carregarHistorico(); 
    }

    // Botão de voltar para a página anterior
    const btnVoltar = document.getElementById('btn-voltar');
    btnVoltar.addEventListener('click', () => {
        window.history.back(); 
    });

    // Carregar o histórico de registros ao iniciar a página
    carregarHistorico();
});
