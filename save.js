// save.js — coleta estado atual da calculadora e salva no localStorage

function collectCurrentSale(buyerName) {
  // Coleta campos Simples
  const pesoCaixa = document.getElementById('peso-caixa')?.value || null;
  const qtdCaixas = document.getElementById('quantidade-caixas')?.value || null;

  let precoCaixa = document.getElementById('preco-caixa')?.value || null;

if (precoCaixa !== null && precoCaixa !== '') {
  const num = parseFloat(precoCaixa.replace(',', '.')); // transforma texto em número
  precoCaixa = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

  // Coleta campos Classificada
  const pb = document.getElementById('peso-boa')?.value || null;
  const prb = document.getElementById('preco-boa')?.value || null;
  const qb = document.getElementById('qtd-boa')?.value || null;
  const pf = document.getElementById('peso-fraca')?.value || null;
  const prf = document.getElementById('preco-fraca')?.value || null;
  const qf = document.getElementById('qtd-fraca')?.value || null;

  // Tipo de negociação e unidade
  const trade = document.querySelector('input[name="trade_type"]:checked')?.value || 'simples';
  const weight = document.querySelector('input[name="weight_type"]:checked')?.value || 'caixa';

  // Totais exibidos
  let soma = null, pesoTotal = null, media = null;
  if (trade === 'simples') {
    soma = document.getElementById('valor-total')?.textContent || null;
    pesoTotal = document.getElementById('peso-total')?.textContent || null;
    media = document.getElementById('valor-por-kg')?.textContent || null;
  } else {
    soma = document.getElementById('soma-valores')?.textContent || null;
    pesoTotal = document.getElementById('peso-total-classificada')?.textContent || null;
    media = document.getElementById('media-preco')?.textContent || null;
  }

  // Cria objeto base
  const sale = {
    id: 'sale-' + Date.now(),
    createdAt: new Date().toISOString(),
    trade,
    weight,
    simples: {},
    classificada: { boa: { pb, prb, qb }, fraca: { pf, prf, qf } },
    totals: {}
  };

  // Ajusta conforme unidade de peso
  if (weight === 'caixa') {
    sale.simples = { pesoCaixa, precoCaixa, qtdCaixas };
    sale.totals = { soma, pesoTotal, media };
  } else {
    sale.simples = { pesoCaixa, media, qtdCaixas };

    sale.totals = { soma, pesoTotal, precoCaixa };
  }

  if (buyerName) sale.buyerName = buyerName;

  return sale;
}


function saveSaleLocally(buyerName) {
  const sale = collectCurrentSale(buyerName);
  const key = 'frutacalc_sales_v1';
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push(sale);
  localStorage.setItem(key, JSON.stringify(data));
  return sale;
}

// exportar função para console/uso global
window.saveSaleLocally = saveSaleLocally;