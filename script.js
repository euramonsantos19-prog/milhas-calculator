// script.js - Lógica da calculadora de milhas

/**
 * Cria e adiciona uma nova linha à tabela.
 */
function addRow(miles = '', costPerThousand = '') {
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

  // Célula de custo por mil
  const costCell = document.createElement('td');
  costCell.className = 'px-2 py-1 border-r border-gray-300';
  const costInput = document.createElement('input');
  costInput.type = 'number';
  costInput.min = '0';
  costInput.step = '0.01';
  costInput.value = costPerThousand;
  costInput.className = 'w-full px-1 py-1 border rounded';
  costInput.addEventListener('input', updateTotals);
  costCell.appendChild(costInput);
  row.appendChild(costCell);

  // Célula de custo total
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
  let totalCost = 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const miles = parseFloat(inputs[0].value) || 0;
    const costPerThousand = parseFloat(inputs[1].value.replace(',', '.')) || 0;
    const costTotal = (miles / 1000) * costPerThousand;
    totalMiles += miles;
    totalCost += costTotal;
    // Atualiza a célula de custo total com formato brasileiro
    const totalCell = row.querySelector('td:last-child');
    totalCell.textContent = costTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  document.getElementById('totalMiles').textContent = totalMiles.toLocaleString('pt-BR');
  document.getElementById('totalCost').textContent = totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const avgCost = totalMiles === 0 ? 0 : (totalCost / totalMiles) * 1000;
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
    { miles: 216000, cost: 12.13 },
    { miles: 196000, cost: 12.76 },
    { miles: 196000, cost: 12.76 },
    { miles: 654000, cost: 13.69 }
  ];
  examples.forEach(item => addRow(item.miles, item.cost));
}

/**
 * Exporta os dados em formato CSV.
 */
function exportCsv() {
  const rows = document.querySelectorAll('#tableBody tr');
  let csvContent = 'Milhas,Custo por 1.000 (R$),Custo total (R$)\n';
  let totalMilesCsv = 0;
  let totalCostCsv = 0;
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const miles = parseFloat(inputs[0].value) || 0;
    const costPerThousand = parseFloat(inputs[1].value) || 0;
    // Custo total já foi calculado e formatado na célula final, porém recuperamos e convertemos para número
    const costTotalStr = row.querySelector('td:last-child').textContent;
    const costTotal = parseFloat(costTotalStr.replace(/\./g, '').replace(',', '.')) || 0;
    csvContent += `${miles},${costPerThousand.toFixed(2)},${costTotal.toFixed(2)}\n`;
    totalMilesCsv += miles;
    totalCostCsv += costTotal;
  });
  // Linha de totais
  csvContent += `Total,${totalMilesCsv},${totalCostCsv.toFixed(2)}\n`;
  // Gera e inicia o download
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