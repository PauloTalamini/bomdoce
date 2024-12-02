let totalRevenue = 0;
let totalExpenses = 0;
let totalBalance = 0;
const totalRevenueElement = document.getElementById('total-revenue');
const totalExpensesElement = document.getElementById('total-expenses');
const totalBalanceElement = document.getElementById('total-balance');
const receitasTableBody = document.querySelector('#receitas-table tbody');
const despesasTableBody = document.querySelector('#despesas-table tbody');


document.getElementById('open-modal-btn').onclick = function () {
    openModal('myModal');
}

document.getElementById('open-modal-btn-mobile').onclick = function () {
    openModal('myModal');
}

document.getElementById('open-modal-btn-mobile-menu-inferior').onclick = function () {
    openModal('myModal');
}

document.getElementById('open-modal-btn-conta').onclick = function () {
    openModal('myModalConta');
}

document.getElementById('open-modal-btn-conta-mobile').onclick = function () {
    openModal('myModalConta');
}

document.getElementById('open-modal-btn-cartao').onclick = function () {
    openModal('myModalCartao');
}

document.getElementById('open-modal-btn-cartao-mobile').onclick = function () {
    openModal('myModalCartao');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

document.querySelector('.close').onclick = function () {
    closeModal('myModal');
}

document.getElementById('transaction-form').onsubmit = function (event) {
    event.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    const transaction = { type, description, category, amount, date };

    saveTransaction(transaction);

    closeModal('myModal');
    document.getElementById('transaction-form').reset();
}

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTables(transactions); // Atualiza as tabelas
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data
    updateTables(transactions); // Atualiza as tabelas
}

function updateTables(transactions) {
    receitasTableBody.innerHTML = '';
    despesasTableBody.innerHTML = '';
    totalRevenue = 0;
    totalExpenses = 0;

    transactions.forEach((transaction, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>${transaction.type === 'expense' ? 'Despesa' : 'Receita'}</td>
            <td>R$ ${transaction.amount.toFixed(2)}</td>
            <td>${transaction.date}</td>
            <td><i class="fas fa-trash-alt" onclick="removeTransaction(${index})" style="cursor: pointer; color: red;font-weight: 400;font-size: 14px;justify-content: center;display: flex;"></i></td>
        `;

        if (transaction.type === 'expense') {
            totalExpenses += transaction.amount;
            totalExpensesElement.textContent = `DESPESAS: R$ ${totalExpenses.toFixed(2)}`;
            despesasTableBody.appendChild(newRow); // Adiciona a linha na tabela de despesas
        } else {
            totalRevenue += transaction.amount;
            totalRevenueElement.textContent = `RECEITAS: R$ ${totalRevenue.toFixed(2)}`;
            receitasTableBody.appendChild(newRow); // Adiciona a linha na tabela de receitas
        }
    });

    totalBalance = totalRevenue - totalExpenses;
    totalBalanceElement.textContent = `TOTAL: R$ ${totalBalance.toFixed(2)}`;

    // Atualizar gráficos
    updateEntradasGraph(transactions);
    updateDespesasGraph(transactions);
    updateEntradaSaidaGraph(transactions);
    updateCategoriasGraph(transactions);
}


function removeTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1); // Remove a transação pelo índice
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Atualiza o armazenamento local
    updateTables(transactions); // Atualiza a visualização
}

window.onload = loadTransactions;

function addAccount(event) {
    event.preventDefault();

    const accountName = document.getElementById('account-name').value;
    const accountBalance = parseFloat(document.getElementById('account-balance').value);
    const bankLogo = document.getElementById('bank-logo-account').value;

    const accountItem = document.createElement('div');
    accountItem.innerHTML = `<img src="${bankLogo}" style="width: 30px; height: 30px;"> ${accountName} - R$ ${accountBalance.toFixed(2)}`;
    document.querySelector('.minhas-contas').appendChild(accountItem);

    closeModal('myModalConta');
    document.getElementById('account-form').reset();
}

function addCard(event) {
    event.preventDefault();

    const cardName = document.getElementById('card-name').value;
    const cardLimit = parseFloat(document.getElementById('card-limit').value);
    const bankLogo = document.getElementById('bank-logo-card').value;

    const cardItem = document.createElement('div');
    cardItem.innerHTML = `<img src="${bankLogo}" style="width: 30px; height: 30px;"> ${cardName} - Limite: R$ ${cardLimit.toFixed(2)}`;
    document.querySelector('.meus-cartões').appendChild(cardItem);

    closeModal('myModalCartao');
    document.getElementById('card-form').reset();
}

function addAccount(event) {
    event.preventDefault();

    const accountName = document.getElementById('account-name').value;
    const accountBalance = parseFloat(document.getElementById('account-balance').value);
    const bankLogoAccount = document.getElementById('bank-logo-account').value;

    const account = { name: accountName, balance: accountBalance, logo: bankLogoAccount };

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.push(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    updateAccounts();
    closeModal('myModalConta');
    document.getElementById('account-form').reset();
}

function addCard(event) {
    event.preventDefault();

    const cardName = document.getElementById('card-name').value;
    const cardLimit = parseFloat(document.getElementById('card-limit').value);
    const bankLogoCard = document.getElementById('bank-logo-card').value;

    const card = { name: cardName, limit: cardLimit, logo: bankLogoCard };

    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push(card);
    localStorage.setItem('cards', JSON.stringify(cards));

    updateCards();
    closeModal('myModalCartao');
    document.getElementById('card-form').reset();
}

function updateAccounts() {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountsContainer = document.querySelector('.minhas-contas');
    accountsContainer.innerHTML = '<i class="fas fa-credit-card"></i><span>Minhas Contas</span>';

    accounts.forEach(account => {
        const accountElement = document.createElement('div');
        accountElement.innerHTML = `<img src="${account.logo}" style="width:30px; margin-right:5px;vertical-align: middle;border-radius:50%;">${account.name} - Saldo: R$ ${account.balance.toFixed(2)}`;
        accountsContainer.appendChild(accountElement);
    });
}

function updateCards() {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const cardsContainer = document.querySelector('.meus-cartões');
    cardsContainer.innerHTML = '<i class="fas fa-id-card"></i><span>Meus Cartões</span>';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `<img src="${card.logo}" style="width:20px; margin-right:5px;vertical-align: middle;border-radius:50%;">${card.name} - Limite: R$ ${card.limit.toFixed(2)}`;
        cardsContainer.appendChild(cardElement);
    });
}

// Carregar contas e cartões ao iniciar a página
window.onload = function () {
    loadTransactions();
    updateAccounts();
    updateCards();
};

// aqui - - - - - Função de atualização das contas e cálculo do total de saldo das contas
function updateAccounts() {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountsContainer = document.querySelector('.minhas-contas');
    accountsContainer.innerHTML = '<i class="fas fa-credit-card"></i><span>Minhas Contas</span>';

    let totalAccountBalance = 0; // Total de saldo das contas

    accounts.forEach(account => {
        const accountElement = document.createElement('div');
        accountElement.innerHTML = `<img src="${account.logo}" style="width:20px; margin-right:5px;vertical-align: middle;border-radius:50%;">${account.name} - Saldo: R$ ${account.balance.toFixed(2)}`;
        accountsContainer.appendChild(accountElement);

        totalAccountBalance += account.balance; // Soma dos saldos das contas
    });

    // Atualiza o valor total no bloco de Saldo Contas
    document.querySelector('#total-account-balance').textContent = `SALDO CONTAS: R$ ${totalAccountBalance.toFixed(2)}`;
}

// Função de atualização dos cartões e cálculo do total dos limites dos cartões
function updateCards() {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const cardsContainer = document.querySelector('.meus-cartões');
    cardsContainer.innerHTML = '<i class="fas fa-id-card"></i><span>Meus Cartões</span>';

    let totalCardLimit = 0; // Total de limite dos cartões

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `<img src="${card.logo}" style="width:20px; margin-right:5px;vertical-align: middle;border-radius:50%;">${card.name} - Limite: R$ ${card.limit.toFixed(2)}`;
        cardsContainer.appendChild(cardElement);

        totalCardLimit += card.limit; // Soma dos limites dos cartões
    });

    // Atualiza o valor total no bloco de Limite Cartões
    document.querySelector('#total-card-limit').textContent = `LIMITE CARTÕES: R$ ${totalCardLimit.toFixed(2)}`;
}

// Carregar contas e cartões ao iniciar a página
window.onload = function () {
    loadTransactions(); // Carrega as transações
    updateAccounts();    // Atualiza as contas e soma os saldos
    updateCards();       // Atualiza os cartões e soma os limites
};
function updateAccounts() {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountsContainer = document.querySelector('.minhas-contas');
    accountsContainer.innerHTML = '<i class="fas fa-credit-card"></i><span>Minhas Contas</span>';

    let totalAccountBalance = 0; // Total de saldo das contas

    accounts.forEach((account, index) => {
        const accountElement = document.createElement('div');
        accountElement.innerHTML = `
                <img src="${account.logo}" style="width:20px; margin-right:5px;vertical-align: middle;border-radius:50%;">
                ${account.name} - Saldo: R$ ${account.balance.toFixed(2)} 
                <i class="fas fa-trash-alt" onclick="removeAccount(${index})" style="cursor: pointer; color: red;font-weight: 400;vertical-align: middle;margin-left: 4%;
    margin-right: auto;"></i>
            `;
        accountsContainer.appendChild(accountElement);

        totalAccountBalance += account.balance; // Soma dos saldos das contas
    });

    // Atualiza o valor total no bloco de Saldo Contas
    document.querySelector('#total-account-balance').textContent = `SALDO CONTAS: R$ ${totalAccountBalance.toFixed(2)}`;
}

function removeAccount(index) {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.splice(index, 1); // Remove a conta pelo índice
    localStorage.setItem('accounts', JSON.stringify(accounts)); // Atualiza o armazenamento local
    updateAccounts(); // Atualiza a visualização
}

function updateCards() {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const cardsContainer = document.querySelector('.meus-cartões');
    cardsContainer.innerHTML = '<i class="fas fa-id-card"></i><span>Meus Cartões</span>';

    let totalCardLimit = 0; // Total de limite dos cartões

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `
                <img src="${card.logo}" style="width:20px; margin-right:5px;vertical-align: middle;border-radius:50%;">
                ${card.name} - Limite: R$ ${card.limit.toFixed(2)} 
                <i class="fas fa-trash-alt" onclick="removeCard(${index})" style="cursor: pointer; color: red;font-weight: 400;vertical-align: middle;margin-left: 4%;
    margin-right: auto;"></i>
            `;
        cardsContainer.appendChild(cardElement);

        totalCardLimit += card.limit; // Soma dos limites dos cartões
    });

    // Atualiza o valor total no bloco de Limite Cartões
    document.querySelector('#total-card-limit').textContent = `LIMITE CARTÕES: R$ ${totalCardLimit.toFixed(2)}`;
}

function removeCard(index) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.splice(index, 1); // Remove o cartão pelo índice
    localStorage.setItem('cards', JSON.stringify(cards)); // Atualiza o armazenamento local
    updateCards(); // Atualiza a visualização
}

// Carregar contas e cartões ao iniciar a página
window.onload = function () {
    loadTransactions(); // Carrega as transações
    updateAccounts();    // Atualiza as contas e soma os saldos
    updateCards();       // Atualiza os cartões e soma os limites
};

document.getElementById('filter-banks').onclick = function () {
    toggleDropdown('banks-dropdown');
};

document.getElementById('filter-expenses').onclick = function () {
    toggleDropdown('expenses-dropdown');
};

document.getElementById('filter-categories').onclick = function () {
    toggleDropdown('categories-dropdown');
};

document.getElementById('filter-period').onclick = function () {
    toggleDropdown('period-dropdown');
};

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('clear-filters').onclick = function () {
    clearFilters();
};

function clearFilters() {
    // Limpa todos os checkboxes
    document.querySelectorAll('.dropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpa as datas
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';

    // Atualiza as tabelas para mostrar todos os itens
    loadTransactions(); // Chama a função que recarrega as transações
}

function applyFilters() {
    const selectedBanks = Array.from(document.querySelectorAll('#banks-dropdown input:checked')).map(cb => cb.value);
    const selectedExpenses = Array.from(document.querySelectorAll('#expenses-dropdown input:checked')).map(cb => cb.value);
    const selectedCategories = Array.from(document.querySelectorAll('#categories-dropdown input:checked')).map(cb => cb.value);
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Lógica para filtrar as transações conforme as seleções
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filteredTransactions = transactions.filter(transaction => {
        const isBankMatched = selectedBanks.length ? selectedBanks.includes(transaction.bank) : true;
        const isExpenseMatched = selectedExpenses.length ? selectedExpenses.includes(transaction.expense) : true;
        const isCategoryMatched = selectedCategories.length ? selectedCategories.includes(transaction.category) : true;
        const isDateMatched = (!startDate || new Date(transaction.date) >= new Date(startDate)) &&
            (!endDate || new Date(transaction.date) <= new Date(endDate));

        return isBankMatched && isExpenseMatched && isCategoryMatched && isDateMatched;
    });

    updateTables(filteredTransactions); // Atualiza as tabelas com os itens filtrados
}

// Atualizar as tabelas após a seleção de filtros
document.querySelectorAll('.dropdown input[type="checkbox"]').forEach(checkbox => {
    checkbox.onchange = applyFilters;
});

document.getElementById('start-date').onchange = applyFilters;
document.getElementById('end-date').onchange = applyFilters;




// Export
document.getElementById('export-excel').onclick = function () {
    exportData('excel');
};

document.getElementById('export-pdf').onclick = function () {
    exportData('pdf');
};

function exportData(format) {
    const exportChoice = prompt("Você gostaria de baixar: 1) Despesas, 2) Receitas ou 3) Ambos? (Digite o número)");

    if (exportChoice === '1') {
        if (format === 'excel') exportToExcel('despesas-table');
        else if (format === 'pdf') exportToPDF('despesas-table');
    } else if (exportChoice === '2') {
        if (format === 'excel') exportToExcel('receitas-table');
        else if (format === 'pdf') exportToPDF('receitas-table');
    } else if (exportChoice === '3') {
        if (format === 'excel') exportBothToExcel();
        else if (format === 'pdf') exportBothToPDF();
    } else {
        alert("Opção inválida. Tente novamente.");
    }
}

function exportToExcel(tableId) {
    const table = document.getElementById(tableId);
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, `${tableId}.xlsx`);
}

function exportBothToExcel() {
    const wb = XLSX.utils.book_new();
    const receitas = document.getElementById('receitas-table');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(receitas), "Receitas");
    const despesas = document.getElementById('despesas-table');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(despesas), "Despesas");

    XLSX.writeFile(wb, `Receitas_e_Despesas.xlsx`);
}

function exportToPDF(tableId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.getElementById(tableId);
    const rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));

    doc.autoTable({
        head: [rows[0]],
        body: rows.slice(1),
        theme: 'grid'
    });
    doc.save(`${tableId}.pdf`);
}

function exportBothToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let receitas = document.getElementById('receitas-table');
    let receitasRows = Array.from(receitas.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
    doc.autoTable({
        head: [receitasRows[0]],
        body: receitasRows.slice(1),
        theme: 'grid'
    });

    doc.addPage();

    let despesas = document.getElementById('despesas-table');
    let despesasRows = Array.from(despesas.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
    doc.autoTable({
        head: [despesasRows[0]],
        body: despesasRows.slice(1),
        theme: 'grid'
    });

    doc.save(`Receitas_e_Despesas.pdf`);
}


// Seleciona os botões de alternar modo noturno
const darkModeToggleDesktop = document.getElementById('darkModeToggle');
const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');

// Função para alternar o modo noturno
function toggleDarkMode() {
    // Alterna a classe "dark-mode" no body
    document.body.classList.toggle('dark-mode');

    // Determina o ícone atual baseado no estado
    const isDarkMode = document.body.classList.contains('dark-mode');
    const iconClass = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';

    // Atualiza o ícone no botão desktop, se existir
    if (darkModeToggleDesktop) {
        darkModeToggleDesktop.querySelector('i').className = iconClass;
    }

    // Atualiza o ícone no botão mobile, se existir
    if (darkModeToggleMobile) {
        darkModeToggleMobile.querySelector('i').className = iconClass;
    }

    // (Opcional) Salvar preferência no localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Adiciona os eventos de clique nos botões
if (darkModeToggleDesktop) {
    darkModeToggleDesktop.addEventListener('click', toggleDarkMode);
}
if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener('click', toggleDarkMode);
}

// Verifica e aplica o estado salvo do modo noturno (localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const iconClass = 'fas fa-sun';
        if (darkModeToggleDesktop) {
            darkModeToggleDesktop.querySelector('i').className = iconClass;
        }
        if (darkModeToggleMobile) {
            darkModeToggleMobile.querySelector('i').className = iconClass;
        }
    }
});



function exportToPDF(tableId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.getElementById(tableId);
    if (!table) {
        alert("Tabela não encontrada!");
        return;
    }

    const rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));

    if (rows.length === 0) {
        alert("A tabela está vazia.");
        return;
    }

    doc.autoTable({
        head: [rows[0]],  // Certifique-se de que rows[0] é um array de cabeçalhos
        body: rows.slice(1),
        theme: 'grid',
        startY: 20,  // Para evitar sobrepor o título da página, se houver
    });
    doc.save(`${tableId}.pdf`);
}

function exportBothToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let receitas = document.getElementById('receitas-table');
    if (receitas) {
        let receitasRows = Array.from(receitas.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
        doc.autoTable({
            head: [receitasRows[0]],
            body: receitasRows.slice(1),
            theme: 'grid',
            startY: 20,  // Evita que a tabela sobreponha o título
        });
        doc.addPage();
    } else {
        alert("Tabela de receitas não encontrada.");
    }

    let despesas = document.getElementById('despesas-table');
    if (despesas) {
        let despesasRows = Array.from(despesas.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
        doc.autoTable({
            head: [despesasRows[0]],
            body: despesasRows.slice(1),
            theme: 'grid',
        });
    } else {
        alert("Tabela de despesas não encontrada.");
    }

    doc.save(`Receitas_e_Despesas.pdf`);
}

// menu mobile

function toggleMenu() {
    // Alterna a visibilidade do menu
    document.getElementById("sidebar").classList.toggle("open");

    // Alterna o ícone de hambúrguer para "X" e vice-versa
    var menuIcon = document.getElementById("menu-icon");
    if (menuIcon.classList.contains("fa-bars")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times"); // Muda para o ícone de "X"
    } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars"); // Volta para o ícone de hambúrguer
    }
}


// Gráfico mobile
document.querySelector('.toggle-graph').addEventListener('click', function (event) {
    event.preventDefault(); // Previne o comportamento padrão do link

    // Seleciona as seções
    const blocoDespesas = document.querySelector('.bloco-de-despesas');
    const graficoBloco = document.querySelector('.grafico-bloco');
    const lancamentos = document.querySelector('.lancamentos');

    // Alterna a visibilidade das seções
    blocoDespesas.style.display = 'none'; // Oculta o bloco de despesas
    graficoBloco.style.display = 'flex'; // Mostra o bloco de gráficos
    lancamentos.style.display = 'none'; // Oculta a seção de lançamentos
});

// Tabelas mobile
document.querySelector('.toggle-table').addEventListener('click', function (event) {
    event.preventDefault(); // Previne o comportamento padrão do link

    // Seleciona as seções
    const blocoDespesas = document.querySelector('.bloco-de-despesas');
    const graficoBloco = document.querySelector('.grafico-bloco');
    const lancamentos = document.querySelector('.lancamentos');

    // Alterna a visibilidade das seções
    blocoDespesas.style.display = 'none'; // Oculta o bloco de despesas
    graficoBloco.style.display = 'none'; // Oculta o bloco de gráficos
    lancamentos.style.display = 'flex'; // Mostra a seção de lançamentos
});



// Variáveis globais para armazenar instâncias dos gráficos
let entradasChart, despesasChart, entradaSaidaChart, categoriasChart;

// Gráfico Top 5 Entradas por Categorias
function updateEntradasGraph(transactions) {
    const entradasPorCategoria = transactions
        .filter(t => t.type === 'revenue')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const categorias = Object.keys(entradasPorCategoria);
    const valores = Object.values(entradasPorCategoria);

    const sorted = categorias.map((c, i) => ({ categoria: c, valor: valores[i] }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

    const ctx = document.getElementById('entradasGraph').getContext('2d');

    if (entradasChart) entradasChart.destroy(); // Destrói o gráfico existente
    entradasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(e => e.categoria),
            datasets: [{
                label: 'Entradas por Categoria',
                data: sorted.map(e => e.valor),
                backgroundColor: '#4caf50',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Gráfico Top 5 Despesas
function updateDespesasGraph(transactions) {
    const despesasPorCategoria = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const categorias = Object.keys(despesasPorCategoria);
    const valores = Object.values(despesasPorCategoria);

    const sorted = categorias.map((c, i) => ({ categoria: c, valor: valores[i] }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

    const ctx = document.getElementById('despesasGraph').getContext('2d');

    if (despesasChart) despesasChart.destroy(); // Destrói o gráfico existente
    despesasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(e => e.categoria),
            datasets: [{
                label: 'Despesas por Categoria',
                data: sorted.map(e => e.valor),
                backgroundColor: '#f44336',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Gráfico Despesas Mensais Entrada x Saída
function updateEntradaSaidaGraph(transactions) {
    const monthlyData = transactions.reduce((acc, curr) => {
        const month = new Date(curr.date).toISOString().slice(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = { entradas: 0, despesas: 0 };
        if (curr.type === 'revenue') acc[month].entradas += curr.amount;
        if (curr.type === 'expense') acc[month].despesas += curr.amount;
        return acc;
    }, {});

    const months = Object.keys(monthlyData).sort();
    const entradas = months.map(m => monthlyData[m].entradas);
    const despesas = months.map(m => monthlyData[m].despesas);

    const ctx = document.getElementById('entradaSaidaGraph').getContext('2d');

    if (entradaSaidaChart) entradaSaidaChart.destroy(); // Destrói o gráfico existente
    entradaSaidaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                { label: 'Entradas', data: entradas, backgroundColor: '#4caf50' },
                { label: 'Despesas', data: despesas, backgroundColor: '#f44336' }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Gráfico Sobre Categorias
function updateCategoriasGraph(transactions) {
    const despesasPorCategoria = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const categorias = Object.keys(despesasPorCategoria);
    const valores = Object.values(despesasPorCategoria);

    const ctx = document.getElementById('categoriasGraph').getContext('2d');

    if (categoriasChart) categoriasChart.destroy(); // Destrói o gráfico existente
    categoriasChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: valores,
                backgroundColor: ['#f44336', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: { size: 12, family: 'Arial' } }
                }
            }
        }
    });
}


