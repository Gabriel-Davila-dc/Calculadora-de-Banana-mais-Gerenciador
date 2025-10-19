// script mínimo para abrir/fechar o menu no mobile
document.addEventListener('DOMContentLoaded', function(){
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-navigation');
  if(!btn || !nav) return;

  btn.addEventListener('click', function(e){
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      nav.style.display = 'block';
    } else {
      nav.style.display = '';
    }
  });

  // fechar ao clicar fora do menu (em telas mobile)
  document.addEventListener('click', function(e){
    if(window.innerWidth >= 768) return;
    if(!btn.contains(e.target) && !nav.contains(e.target)){
      btn.setAttribute('aria-expanded', 'false');
      nav.style.display = '';
    }
  });
});
