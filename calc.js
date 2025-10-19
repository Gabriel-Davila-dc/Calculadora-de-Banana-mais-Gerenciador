document.addEventListener('DOMContentLoaded', function(){
  const tradeRadios = document.querySelectorAll('input[name="trade_type"]');
  const weightRadios = document.querySelectorAll('input[name="weight_type"]');
  const calculator = document.getElementById('calculator');
  const pesoInput = document.getElementById('peso-caixa');
  const precoInput = document.getElementById('preco-caixa');
  const qtdInput = document.getElementById('quantidade-caixas');
  const resultBox = document.getElementById('calc-result');
  const valorTotalEl = document.getElementById('valor-total');
  const pesoTotalEl = document.getElementById('peso-total');
  const valorPorKgEl = document.getElementById('valor-por-kg');
  const precoLabel = document.getElementById('preco-label');
  const labelTotal = document.getElementById('label-total');
  const labelSecond = document.getElementById('label-second');
  const simpleSection = document.getElementById('simple-section');
  const classificadaSection = document.getElementById('classificada-section');

  // classificada inputs
  const pesoBoaInput = document.getElementById('peso-boa');
  const precoBoaInput = document.getElementById('preco-boa');
  const qtdBoaInput = document.getElementById('qtd-boa');

  const pesoFracaInput = document.getElementById('peso-fraca');
  const precoFracaInput = document.getElementById('preco-fraca');
  const qtdFracaInput = document.getElementById('qtd-fraca');

  const valorTotalBoaEl = document.getElementById('valor-total-boa');
  const pesoTotalBoaEl = document.getElementById('peso-total-boa');
  const valorTerceiroBoaEl = document.getElementById('valor-terceiro-boa');

  const valorTotalFracaEl = document.getElementById('valor-total-fraca');
  const pesoTotalFracaEl = document.getElementById('peso-total-fraca');
  const valorTerceiroFracaEl = document.getElementById('valor-terceiro-fraca');

  const somaValoresEl = document.getElementById('soma-valores');
  const mediaPrecoEl = document.getElementById('media-preco');
  const pesoTotalClassificadaEl = document.getElementById('peso-total-classificada');
  const labelThird = document.getElementById('label-third');
  // rótulos dos resultados por classe
  const labelValorBoa = document.getElementById('label-valor-boa');
  const labelPesoBoa = document.getElementById('label-peso-boa');
  const labelTerceiroBoa = document.getElementById('label-terceiro-boa');

  const labelValorFraca = document.getElementById('label-valor-fraca');
  const labelPesoFraca = document.getElementById('label-peso-fraca');
  const labelTerceiroFraca = document.getElementById('label-terceiro-fraca');
  const labelMedia = document.getElementById('label-media');

  if(!calculator) return;

  // flag para indicar se o usuário editou manualmente o campo peso-fraca
  let fracaEdited = false;

  function getSelectedValue(radios){
    for(const r of radios) if(r.checked) return r.value;
    return null;
  }

  function updateVisibility(){
    const trade = getSelectedValue(tradeRadios);
    const weight = getSelectedValue(weightRadios);

    // mostrar a calculadora sempre que for 'simples' ou 'classificada'
    if(trade === 'simples' || trade === 'classificada'){
      calculator.classList.add('visible');
      if(resultBox) resultBox.setAttribute('aria-hidden','false');
    } else {
      calculator.classList.remove('visible');
      if(resultBox) resultBox.setAttribute('aria-hidden','true');
    }

    // mostrar seção correta
    if(trade === 'classificada'){
      if(simpleSection) simpleSection.style.display = 'none';
      if(classificadaSection) classificadaSection.style.display = '';
      // ao entrar no modo classificada, permitir sincronizar peso novamente
      fracaEdited = false;
    } else {
      if(simpleSection) simpleSection.style.display = '';
      if(classificadaSection) classificadaSection.style.display = 'none';
    }

    // atualizar rótulos dependendo do modo de peso
    if(weight === 'quilo'){
      if(precoLabel) precoLabel.textContent = 'Preço por 1 kg (R$)';
      if(labelTotal) labelTotal.textContent = 'Valor total:';
      if(labelSecond) labelSecond.textContent = 'Peso total:';
      if(labelThird) labelThird.textContent = 'Valor da caixa:';
    } else {
      if(precoLabel) precoLabel.textContent = 'Preço da caixa (R$)';
      if(labelTotal) labelTotal.textContent = 'Valor total:';
      if(labelSecond) labelSecond.textContent = 'Peso total:';
      if(labelThird) labelThird.textContent = 'Valor por 1 kg:';
    }

    // atualizar rótulos dentro dos cartões de resultado por classe
    if(weight === 'quilo'){
      if(labelTerceiroBoa) labelTerceiroBoa.textContent = 'Valor da caixa:';
      if(labelTerceiroFraca) labelTerceiroFraca.textContent = 'Valor da caixa:';
      // manter os demais rótulos padronizados
      if(labelValorBoa) labelValorBoa.textContent = 'Valor total:';
      if(labelValorFraca) labelValorFraca.textContent = 'Valor total:';
      if(labelPesoBoa) labelPesoBoa.textContent = 'Peso total:';
      if(labelPesoFraca) labelPesoFraca.textContent = 'Peso total:';
    } else {
      if(labelTerceiroBoa) labelTerceiroBoa.textContent = 'Valor por 1 kg:';
      if(labelTerceiroFraca) labelTerceiroFraca.textContent = 'Valor por 1 kg:';
      if(labelValorBoa) labelValorBoa.textContent = 'Valor total:';
      if(labelValorFraca) labelValorFraca.textContent = 'Valor total:';
      if(labelPesoBoa) labelPesoBoa.textContent = 'Peso total:';
      if(labelPesoFraca) labelPesoFraca.textContent = 'Peso total:';
    }

    // atualizar rótulo da média dependendo do modo e do tipo de negociação
    if(labelMedia){
      if(trade === 'simples'){
        // em Simples: mostrar preço relativo ao modo de medida (se quilo => preço do quilo, se caixa => preço da caixa)
        if(weight === 'quilo') labelMedia.textContent = 'Preço do Quilo:';
        else labelMedia.textContent = 'Preço da Caixa:';
      } else if (trade === 'classificada'){
        // em Classificada: queremos que a média nos Totais reflita a mesma unidade mostrada nos cartões (terceiro rótulo)
        // quando weight === 'quilo' os cartões mostram 'Valor da caixa' -> média por caixa
        if(weight === 'quilo') labelMedia.textContent = 'Média de preço (por caixa):';
        else labelMedia.textContent = 'Média de preço (R$/kg):';
      }
    }
  }

  function formatBRL(v){
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calculate() {
    const trade = getSelectedValue(tradeRadios);
    const weightMode = getSelectedValue(weightRadios);

    // Simples
    if (trade === 'simples') {
      const peso = parseFloat(pesoInput && pesoInput.value);
      const preco = parseFloat(precoInput && precoInput.value);
      const qtd = parseInt(qtdInput && qtdInput.value, 10);

      if (Number.isFinite(peso) && Number.isFinite(preco) && Number.isInteger(qtd) && qtd > 0 && peso > 0) {
        const pesoTotal = peso * qtd;
        let valorTotal = 0;
        let terceiro = 0;

        if (weightMode === 'quilo') {
          valorTotal = preco * pesoTotal; // preco = R$/kg
          terceiro = preco * peso; // valor da caixa
        } else {
          valorTotal = preco * qtd; // preco por caixa
          terceiro = pesoTotal > 0 ? (valorTotal / pesoTotal) : 0; // valor por 1 kg
        }

        if (valorTotalEl) valorTotalEl.textContent = formatBRL(valorTotal);
        if (pesoTotalEl) pesoTotalEl.textContent = pesoTotal.toFixed(2) + ' kg';
        if (valorPorKgEl) valorPorKgEl.textContent = formatBRL(terceiro);
      } else {
        if (valorTotalEl) valorTotalEl.textContent = '—';
        if (pesoTotalEl) pesoTotalEl.textContent = '—';
        if (valorPorKgEl) valorPorKgEl.textContent = '—';
      }

      // limpar classificada
      if (valorTotalBoaEl) valorTotalBoaEl.textContent = '—';
      if (pesoTotalBoaEl) pesoTotalBoaEl.textContent = '—';
      if (valorTerceiroBoaEl) valorTerceiroBoaEl.textContent = '—';
      if (valorTotalFracaEl) valorTotalFracaEl.textContent = '—';
      if (pesoTotalFracaEl) pesoTotalFracaEl.textContent = '—';
      if (valorTerceiroFracaEl) valorTerceiroFracaEl.textContent = '—';
      if (somaValoresEl) somaValoresEl.textContent = '—';
      if (mediaPrecoEl) mediaPrecoEl.textContent = '—';
    }

    // Classificada
    if (trade === 'classificada') {
      const pb = parseFloat(pesoBoaInput && pesoBoaInput.value);
      const prb = parseFloat(precoBoaInput && precoBoaInput.value);
      const qb = parseInt(qtdBoaInput && qtdBoaInput.value, 10);

      const pf = parseFloat(pesoFracaInput && pesoFracaInput.value);
      const prf = parseFloat(precoFracaInput && precoFracaInput.value);
      const qf = parseInt(qtdFracaInput && qtdFracaInput.value, 10);

      const hasBoa = Number.isFinite(pb) && Number.isFinite(prb) && Number.isInteger(qb) && qb > 0 && pb > 0;
      const hasFraca = Number.isFinite(pf) && Number.isFinite(prf) && Number.isInteger(qf) && qf > 0 && pf > 0;

      let valorTotalBoa = 0, pesoTotalBoa = 0, terceiroBoa = 0;
      let valorTotalFraca = 0, pesoTotalFraca = 0, terceiroFraca = 0;

      if (hasBoa) {
        pesoTotalBoa = pb * qb;
        if (weightMode === 'quilo') {
          valorTotalBoa = prb * pesoTotalBoa; // preco = R$/kg
          terceiroBoa = prb * pb; // valor da caixa
        } else {
          valorTotalBoa = prb * qb; // preco por caixa
          terceiroBoa = pesoTotalBoa > 0 ? (valorTotalBoa / pesoTotalBoa) : 0; // valor por 1 kg
        }
      }

      if (hasFraca) {
        pesoTotalFraca = pf * qf;
        if (weightMode === 'quilo') {
          valorTotalFraca = prf * pesoTotalFraca;
          terceiroFraca = prf * pf;
        } else {
          valorTotalFraca = prf * qf;
          terceiroFraca = pesoTotalFraca > 0 ? (valorTotalFraca / pesoTotalFraca) : 0;
        }
      }

      if (valorTotalBoaEl) valorTotalBoaEl.textContent = hasBoa ? formatBRL(valorTotalBoa) : '—';
      if (pesoTotalBoaEl) pesoTotalBoaEl.textContent = hasBoa ? pesoTotalBoa.toFixed(2) + ' kg' : '—';
      if (valorTerceiroBoaEl) valorTerceiroBoaEl.textContent = hasBoa ? formatBRL(terceiroBoa) : '—';

      if (valorTotalFracaEl) valorTotalFracaEl.textContent = hasFraca ? formatBRL(valorTotalFraca) : '—';
      if (pesoTotalFracaEl) pesoTotalFracaEl.textContent = hasFraca ? pesoTotalFraca.toFixed(2) + ' kg' : '—';
      if (valorTerceiroFracaEl) valorTerceiroFracaEl.textContent = hasFraca ? formatBRL(terceiroFraca) : '—';

      const soma = (hasBoa ? valorTotalBoa : 0) + (hasFraca ? valorTotalFraca : 0);
      if (somaValoresEl) somaValoresEl.textContent = formatBRL(soma);

      const totalPeso = (hasBoa ? pesoTotalBoa : 0) + (hasFraca ? pesoTotalFraca : 0);
      if(pesoTotalClassificadaEl) pesoTotalClassificadaEl.textContent = totalPeso.toFixed(2) + ' kg';

      // A média exibida nos Totais deve seguir a mesma unidade mostrada nos rótulos "terceiro" das classes.
      // Os rótulos "terceiro" são: quando weightMode === 'quilo' mostram 'Valor da caixa' -> média por caixa
      // quando weightMode === 'caixa' mostram 'Valor por 1 kg' -> média por kg
      let media = 0;
      if (weightMode === 'quilo') {
        // mostrar média por caixa
        const totalCaixas = (hasBoa ? qb : 0) + (hasFraca ? qf : 0);
        if (totalCaixas > 0) media = soma / totalCaixas; // preço médio por caixa
      } else {
        // mostrar média por kg (ponderada)
        if (totalPeso > 0) media = soma / totalPeso; // R$/kg média ponderada
      }
      if (mediaPrecoEl) mediaPrecoEl.textContent = (media > 0) ? formatBRL(media) : '—';
    }
  }

  // eventos
  tradeRadios.forEach(r=> r.addEventListener('change', function(){ updateVisibility(); calculate(); }));
  weightRadios.forEach(r=> r.addEventListener('change', function(){ updateVisibility(); calculate(); }));


  // sincronização: quando usuário digita em peso-boa, copiar para peso-fraca enquanto o usuário não editou fraca manualmente
  if (pesoBoaInput) {
    pesoBoaInput.addEventListener('input', function () {
      if (!fracaEdited && pesoFracaInput) {
        pesoFracaInput.value = this.value;
      }
      calculate();
    });
  }

  // se o usuário digitar no campo peso-fraca, marcar como editado para não sobrescrever
  if (pesoFracaInput) {
    pesoFracaInput.addEventListener('input', function () {
      fracaEdited = true;
      calculate();
    });
    // se o usuário focar e limpar, ainda consideramos que ele editou manualmente
    pesoFracaInput.addEventListener('change', function () { fracaEdited = true; });
  }

  // recalcula automaticamente quando os demais inputs mudam (inclui campos classificada exceto peso-boa/fraca que já tratamos)
  [pesoInput, precoInput, qtdInput, precoBoaInput, qtdBoaInput, precoFracaInput, qtdFracaInput]
    .filter(Boolean)
    .forEach(inp=> inp.addEventListener('input', calculate));

  // inicializar visibilidade
  updateVisibility();
});
