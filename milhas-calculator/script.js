// script.js - Lógica da calculadora de milhas

/**
 * Cria e adiciona uma nova linha à tabela.
 */
function addRow(miles = '', totalCost = '') {
  const tableBody = document.getElementById('tableBody');
  const row = document.createElement('tr');
  row.className = 'border-t border-gray-300';

  // Célula de milhas
  const milesCell = document.createElement('td');
  milesCell.className = 'px-2 py-1 border-r border-gray-300';
  const milesInput = document.createElement('input');
  milesInput.type = 'number';
  milesInput.min = '0';
  milesInput.step = '1';
  milesInput.value = miles;
  milesInput.className = 'w-full px-1 py-1 border rounded';
  milesInput.addEventListener('input', updateTotals);
  milesCell.appendChild(milesInput);
  row.appendChild(milesCell);

  // Célula de total gasto
  const costCell = document.createElement('td');
  costCell.className = 'px-2 py-1 border-r border-gray-300';
  const costInput = document.createElement('input');
  costInput.type = 'number';
  costInput.min = '0';
  costInput.step = '0.01';
  costInput.value = totalCost;
  costInput.className = 'w-full px-1 py-1 border rounded';
  costInput.addEventListener('input', updateTotals);
  costCell.appendChild(costInput);
  row.appendChild(costCell);

  // Célula de custo por 1.000
  const totalCell = document.createElement('td');
  totalCell.className = 'px-2 py-1';
  totalCell.textContent = '0,00';
  row.appendChild(totalCell);

  tableBody.appendChild(row);
  updateTotals();
}

/**
 * Atualiza os totais e o custo total de cada linha.
 */
function updateTotals() {
  const rows = document.querySelectorAll('#tableBody tr');
  let totalMiles = 0;
  let totalSpent = 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const miles = parseFloat(inputs[0].value) || 0;
    const totalCostValue = parseFloat(inputs[1].value.replace(',', '.')) || 0;
    const costPerThousand = miles === 0 ? 0 : (totalCostValue / miles) * 1000;
    totalMiles += miles;
    totalSpent += totalCostValue;
    const totalCell = row.querySelector('td:last-child');
    totalCell.textContent = costPerThousand.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  document.getElementById('totalMiles').textContent = totalMiles.toLocaleString('pt-BR');
  document.getElementById('totalCost').textContent = totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const avgCost = totalMiles === 0 ? 0 : (totalSpent / totalMiles) * 1000;
  document.getElementById('avgCost').textContent = avgCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Limpa todas as linhas da tabela.
 */
function clearRows() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  updateTotals();
}

/**
 * Adiciona linhas de exemplo com dados predefinidos.
 */
function fillExample() {
  clearRows();
  // Exemplo com quatro contas
  const examples = [
    { miles: 216000, total: 2620.08 },
    { miles: 196000, total: 2500.96 },
    { miles: 196000, total: 2500.96 },
    { miles: 654000, total: 8953.26 }
  ];
  examples.forEach(item => addRow(item.miles, item.total));
}

/**
 * Exporta os dados em formato CSV.
 */
function exportCsv() {
  const rows = document.querySelectorAll('#tableBody tr');
  let csvContent = 'Milhas,Total gasto (R$),Custo por 1.000 (R$)\n';
  let totalMilesCsv = 0;
  let totalSpentCsv = 0;
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const miles = parseFloat(inputs[0].value) || 0;
    const totalCostValue = parseFloat(inputs[1].value.replace(',', '.')) || 0;
    const costPerThousand = miles === 0 ? 0 : (totalCostValue / miles) * 1000;
    csvContent += `${miles},${totalCostValue.toFixed(2)},${costPerThousand.toFixed(2)}\n`;
    totalMilesCsv += miles;
    totalSpentCsv += totalCostValue;
  });
  // Linha de totais
  csvContent += `Total,${totalMilesCsv.toFixed(0)},${totalSpentCsv.toFixed(2)}\n`;
  const avgCostCsv = totalMilesCsv === 0 ? 0 : (totalSpentCsv / totalMilesCsv) * 1000;
  csvContent += `Custo médio por 1.000,,${avgCostCsv.toFixed(2)}\n`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'milhas.csv');
  link.click();
}

// Eventos de clique
document.getElementById('addRow').addEventListener('click', () => addRow());
document.getElementById('clearRows').addEventListener('click', clearRows);
document.getElementById('exampleRows').addEventListener('click', fillExample);
document.getElementById('exportCsv').addEventListener('click', exportCsv);

// Inicializa com uma linha vazia
addRow();