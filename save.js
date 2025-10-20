// save.js — coleta estado atual da calculadora e salva no localStorage

function collectCurrentSale(buyerName) {
  // Coleta campos Simples
  const pesoCaixa = document.getElementById('peso-caixa')?.value || null;
  const qtdCaixas = document.getElementById('quantidade-caixas')?.value || null;
  var precoCaixa = document.getElementById('preco-caixa')?.value || null;



  // Coleta campos Classificada
  var pb = document.getElementById('peso-boa')?.value || null;
  var prb = document.getElementById('preco-boa')?.value || null;
  var qb = document.getElementById('qtd-boa')?.value || null;
  var pf = document.getElementById('peso-fraca')?.value || null;
  var prf = document.getElementById('preco-fraca')?.value || null;
  var qf = document.getElementById('qtd-fraca')?.value || null;

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
    classificada: {},
    totals: {}
  };

  // Ajusta conforme unidade de peso
  if (weight === 'caixa') {
    sale.simples = { pesoCaixa, precoCaixa, qtdCaixas };
    sale.classificada = { boa: { pb, prb, qb }, fraca: { pf, prf, qf } }
    sale.totals = { soma, pesoTotal, media };
  } else {
    sale.simples = { pesoCaixa, media, qtdCaixas };
     prb = prb * pb;
     prf = prf * pf;
    soma = transformaEmNumero(soma);
    pesoTotal = kgParaNumero(pesoTotal);
    media = (soma / pesoTotal).toFixed(2);
    media = formataBrasileiro(media);
    soma = formataBrasileiro(soma);
    pesoTotal = pesoTotal + ' kg';

    console.log(`${media} media  = ${soma} / ${pesoTotal}`);
    sale.classificada = { boa: { pb, prb, qb }, fraca: { pf, prf, qf } }
    sale.totals = { soma, pesoTotal, media };
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


function transformaEmNumero(valor) {
   if (!valor) return 0;

  return parseFloat(
    valor
      .toString()
      .replace(/\s/g, '')      // remove espaços
      .replace('R$', '')       // remove símbolo de moeda
      .replace(/\./g, '')      // remove pontos de milhar
      .replace(',', '.')       // troca vírgula decimal por ponto
  ) || 0;
}

function kgParaNumero(valor) {
  if (!valor) return 0;

  return parseFloat(
    valor
      .toString()
      .replace(/\s/g, '')      // remove espaços
      .replace(/kg/i, '')      // remove "kg" (maiúsculo ou minúsculo)o
  ) || 0;
}

function formataBrasileiro(valor, comSimbolo = false) {
  // Garante que é número
  const numero = parseFloat(valor);
  if (isNaN(numero)) return 'R$ 0,00';

  // Opção com ou sem símbolo de moeda
  return "R$ " + numero.toLocaleString('pt-BR', {
    style: comSimbolo ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
