(function () {
  var K = 'lx_a11y', S = { fs: 0, hc: 0, rm: 0, lib: 0 };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(K) || '{}')); } catch (e) {}
  var st = document.createElement('style');
  st.textContent = '.lx-skip{position:absolute;left:8px;top:-70px;background:#D4AF37;color:#0A1319;padding:10px 14px;border-radius:8px;z-index:300;font-weight:700;text-decoration:none}.lx-skip:focus{top:8px}' +
    ':focus-visible{outline:3px solid #D4AF37;outline-offset:2px}' +
    '#lxA11yBtn{position:fixed;left:0;top:42%;z-index:95;width:42px;height:48px;border-radius:0 12px 12px 0;border:2px solid #D4AF37;border-left:0;background:#0A192F;color:#fff;font-size:22px;cursor:pointer;line-height:1}' +
    '#lxA11y{position:fixed;left:52px;top:calc(42% - 90px);max-height:70vh;overflow:auto;z-index:95;width:268px;max-width:calc(100vw - 28px);background:#0F2340;color:#EAF1FA;border:1px solid #1F4A78;border-radius:14px;padding:14px;display:none;font:14px/1.4 system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.5)}' +
    '#lxA11y.open{display:block}#lxA11y h2{font-size:15px;margin:0 0 10px;color:#fff}#lxA11y button{display:block;width:100%;text-align:left;margin:6px 0;padding:9px 12px;border-radius:10px;border:1px solid #1F4A78;background:#14305A;color:#EAF1FA;font:inherit;cursor:pointer}' +
    '#lxA11y button[aria-pressed=true]{border-color:#D4AF37;color:#D4AF37}#lxA11y .row{display:flex;gap:8px}#lxA11y .row button{text-align:center}' +
    'html.lx-fs1 body{zoom:1.12}html.lx-fs2 body{zoom:1.25}html.lx-fs3 body{zoom:1.4}' +
    'html.lx-hc{--bg:#000;--surface:#000;--surface-2:#111;--text:#fff;--text-dim:#fff;--accent:#FFD400;--border:#fff}html.lx-hc body{background:#000!important;color:#fff!important}html.lx-hc a{color:#FFD400!important;text-decoration:underline}html.lx-hc img{filter:contrast(1.1)}' +
    'html.lx-rm *,html.lx-rm *::before,html.lx-rm *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
  document.head.appendChild(st);
  var html = document.documentElement;
  function save() { try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) {} }
  function apply() {
    ['lx-fs1', 'lx-fs2', 'lx-fs3'].forEach(function (c) { html.classList.remove(c); });
    if (S.fs > 0) html.classList.add('lx-fs' + S.fs);
    html.classList.toggle('lx-hc', !!S.hc); html.classList.toggle('lx-rm', !!S.rm);
    var hc = document.getElementById('lxHc'), rm = document.getElementById('lxRm'), lb = document.getElementById('lxLib');
    if (hc) hc.setAttribute('aria-pressed', String(!!S.hc)); if (rm) rm.setAttribute('aria-pressed', String(!!S.rm)); if (lb) lb.setAttribute('aria-pressed', String(!!S.lib));
  }
  // Link "Pular para o conteúdo"
  var alvo = document.getElementById('conteudo') || document.querySelector('main') || document.querySelector('h1');
  if (alvo) { if (!alvo.id) alvo.id = 'conteudo'; alvo.setAttribute('tabindex', '-1'); }
  var sk = document.createElement('a'); sk.href = '#' + (alvo && alvo.id || 'conteudo'); sk.className = 'lx-skip'; sk.textContent = 'Pular para o conteúdo';
  document.body.insertBefore(sk, document.body.firstChild);
  // VLibras (plugin gratuito do governo federal), carregado só quando a pessoa ativa
  function libras() {
    if (document.querySelector('[vw]')) return;
    var d = document.createElement('div'); d.setAttribute('vw', ''); d.className = 'enabled';
    d.innerHTML = '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.appendChild(d);
    var s = document.createElement('script'); s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    s.onload = function () { try { new window.VLibras.Widget('https://vlibras.gov.br/app'); } catch (e) {} };
    document.head.appendChild(s);
  }
  // Botão e painel
  var b = document.createElement('button'); b.id = 'lxA11yBtn'; b.type = 'button'; b.setAttribute('aria-label', 'Abrir opções de acessibilidade'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'lxA11y'); b.textContent = '♿';
  var p = document.createElement('div'); p.id = 'lxA11y'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Opções de acessibilidade');
  p.innerHTML = '<h2>Acessibilidade</h2><div class="row"><button type="button" id="lxMenos" aria-label="Diminuir o tamanho do texto">A−</button><button type="button" id="lxMais" aria-label="Aumentar o tamanho do texto">A+</button></div>' +
    '<button type="button" id="lxHc" aria-pressed="false">Alto contraste</button><button type="button" id="lxRm" aria-pressed="false">Reduzir animações</button>' +
    '<button type="button" id="lxLib" aria-pressed="false">Tradução em Libras (VLibras)</button><button type="button" id="lxReset">Restaurar padrão</button>' +
    '<a href="' + (window.LX_ROOT || '') + 'acessibilidade.html" style="color:#D4AF37;font-size:13px">Declaração de acessibilidade</a>';
  document.body.appendChild(b); document.body.appendChild(p);
  b.addEventListener('click', function () { var o = p.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && p.classList.contains('open')) { p.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.focus(); } });
  document.getElementById('lxMais').onclick = function () { S.fs = Math.min(3, S.fs + 1); save(); apply(); };
  document.getElementById('lxMenos').onclick = function () { S.fs = Math.max(0, S.fs - 1); save(); apply(); };
  document.getElementById('lxHc').onclick = function () { S.hc = S.hc ? 0 : 1; save(); apply(); };
  document.getElementById('lxRm').onclick = function () { S.rm = S.rm ? 0 : 1; save(); apply(); };
  document.getElementById('lxLib').onclick = function () { S.lib = 1; save(); apply(); libras(); };
  document.getElementById('lxReset').onclick = function () { S = { fs: 0, hc: 0, rm: 0, lib: 0 }; save(); apply(); };
  apply(); if (S.lib) libras();
})();
