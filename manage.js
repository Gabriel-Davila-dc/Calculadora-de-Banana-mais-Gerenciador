// manage.js — listagem simples de vendas salvas em localStorage

(function(){
  const key = 'frutacalc_sales_v1';
  const listEl = document.getElementById('sales-list');

  function load() {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    renderList(data);
  }

  function renderList(data) {
    if(!listEl) return;
    if(!data.length) { listEl.innerHTML = '<p>Nenhuma venda salva.</p>'; return; }

    const ul = document.createElement('div');
    ul.className = 'sales-grid';

    data.slice().reverse().forEach(sale => {
      const card = document.createElement('div');
      card.className = 'sale-card';
      card.innerHTML = `
        <div class="sale-card-head">${new Date(sale.createdAt).toLocaleString()}</div>
        ${sale.buyerName ? `<p><strong>Comprador:</strong> ${sale.buyerName}</p>` : ''}
        <p><strong>Tipo:</strong> ${sale.trade} / ${sale.weight}</p>
        <p><strong>Soma:</strong> ${sale.totals.soma || '—'}</p>
        <p><strong>Peso total:</strong> ${sale.totals.pesoTotal || '—'}</p>
        <p><strong>Média:</strong> ${sale.totals.media || sale.totals.precoCaixa || '—'}</p>
        <div class="sale-detail-line"><button class="detail-link" data-view-id="${sale.id}">Ver detalhes</button></div>
        <div class="sale-actions">
          <button class="save-btn" data-id="${sale.id}">Exportar JSON</button>
          <button class="save-btn danger" data-delete-id="${sale.id}">Excluir</button>
        </div>
      `;
      ul.appendChild(card);
    });

    listEl.innerHTML = '';
    listEl.appendChild(ul);

    // actions
    document.querySelectorAll('[data-delete-id]').forEach(b => b.addEventListener('click', function(){
      const id = this.getAttribute('data-delete-id');
      if(!confirm('Tem certeza que deseja excluir esta venda?')) return;
      deleteById(id);
    }));

    document.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', function(){
      const id = this.getAttribute('data-id');
      exportById(id);
    }));

    // ver detalhes
    document.querySelectorAll('[data-view-id]').forEach(b => b.addEventListener('click', function(){
      const id = this.getAttribute('data-view-id');
      showDetails(id);
    }));
  }

  function deleteById(id){
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = data.filter(s=> s.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    load();
  }

  function exportById(id){
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const sale = data.find(s=> s.id === id);
    if(!sale) return alert('Venda não encontrada');
    const blob = new Blob([JSON.stringify(sale, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sale.id + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }


  // detalhes modal
  const detailsBackdrop = document.getElementById('details-backdrop');
  const detailsBody = document.getElementById('details-body');
  const detailsClose = document.getElementById('details-close');

  // botão voltar para calculadora
  const btnBack = document.getElementById('btn-back');
  if(btnBack) btnBack.addEventListener('click', function(){ window.location.href = 'index.html'; });

  function showDetails(id){
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const sale = data.find(s=> s.id === id);
    if(!sale) return alert('Venda não encontrada');

    // montar HTML de detalhes
    let html = '';
    html += `<p><strong>ID:</strong> ${sale.id}</p>`;
    html += `<p><strong>Data:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>`;
    if(sale.buyerName) html += `<p><strong>Comprador:</strong> ${sale.buyerName}</p>`;
    html += `<p><strong>Tipo:</strong> ${sale.trade} / ${sale.weight}</p>`;

    if(sale.trade === 'simples'){
      html += `<h4>Simples</h4>`;
      html += `<p><strong>Peso da caixa:</strong> ${sale.simples.pesoCaixa || '—'}</p>`;
      html += `<p><strong>Preço da caixa:</strong> ${sale.simples.precoCaixa   || sale.simples.media ||'—'}</p>`;
      console.log(`PrecoCaixa: ${sale.simples.precoCaixa}`);
      console.log(`Media: ${sale.simples.media}`);
      
      html += `<p><strong>Quantidade de caixas:</strong> ${sale.simples.qtdCaixas ||  '—'}</p>`;
    } else {
      html += `<h4>Classificada</h4>`;
      html += `<div class="detail-classes">`;
      html += `<div class="detail-class class-good">`;
      html += `<div class="detail-head">Boa</div>`;
      html += `<p><strong>Peso da caixa:</strong> ${sale.classificada.boa.pb || '—'}</p>`;
      html += `<p><strong>Preço:</strong> ${sale.classificada.boa.prb || '—'}</p>`;
      html += `<p><strong>Quantidade:</strong> ${sale.classificada.boa.qb || '—'}</p>`;
      html += `</div>`;

      html += `<div class="detail-class class-weak">`;
      html += `<div class="detail-head">Fraca</div>`;
      html += `<p><strong>Peso da caixa:</strong> ${sale.classificada.fraca.pf || '—'}</p>`;
      html += `<p><strong>Preço:</strong> ${sale.classificada.fraca.prf || '—'}</p>`;
      html += `<p><strong>Quantidade:</strong> ${sale.classificada.fraca.qf || '—'}</p>`;
      html += `</div>`;
      html += `</div>`;
    }

    // totais
    html += `<h4>Totais</h4>`;
    html += `<p><strong>Soma:</strong> ${sale.totals.soma || '—'}</p>`;
    html += `<p><strong>Peso total:</strong> ${sale.totals.pesoTotal || '—'}</p>`;
    html += `<p><strong>Média:</strong> ${sale.totals.media || sale.totals.precoCaixa || '—'}</p>`;

    if(detailsBody) detailsBody.innerHTML = html;
    if(detailsBackdrop){
      detailsBackdrop.classList.add('visible');
      detailsBackdrop.setAttribute('aria-hidden','false');
    }
  }

  if(detailsClose) detailsClose.addEventListener('click', function(){
    if(detailsBackdrop){ detailsBackdrop.classList.remove('visible'); detailsBackdrop.setAttribute('aria-hidden','true'); }
  });

  // fechar com Esc
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && detailsBackdrop && detailsBackdrop.classList.contains('visible')){ detailsBackdrop.classList.remove('visible'); detailsBackdrop.setAttribute('aria-hidden','true'); } });

  load();
})();