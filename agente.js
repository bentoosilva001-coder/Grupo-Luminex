(function () {
  var C = window.LUMINEX || {}, ROOT = window.LX_ROOT || '';
  var URL_AG = C.agenteUrl || (C.supabaseUrl ? C.supabaseUrl.replace(/\/$/, '') + '/functions/v1/agente' : '');
  var AG = {
    lumivek:  { nome: 'Agente LumiVek',  area: 'Automação e atendimento', ola: 'Olá! Sou o assistente virtual da LumiVek. Posso entender como automatizar o seu atendimento e as tarefas repetitivas. Qual é o seu negócio?', chips: ['Quero um atendente de IA no WhatsApp', 'Quero automatizar tarefas', 'Edição de vídeo em escala'], t: 'Automatizar meu atendimento', s: 'LumiVek · IA no WhatsApp e automação' },
    lumikode: { nome: 'Agente LumiKode', area: 'Sites, sistemas e aplicativos', ola: 'Olá! Sou o assistente virtual da LumiKode. Posso entender o site, o sistema ou o aplicativo que você precisa. O que você quer desenvolver?', chips: ['Preciso de um site', 'Quero um sistema sob medida', 'Quero um aplicativo'], t: 'Site, sistema ou aplicativo', s: 'LumiKode · software sob medida' },
    luminex:  { nome: 'Agente LumiNex',  area: 'Dados, IA e startups', ola: 'Olá! Sou o assistente virtual da LumiNex. Posso entender o seu projeto de dados, inteligência artificial ou produto digital. Por onde quer começar?', chips: ['Quero um dashboard', 'Agente de IA para minha empresa', 'Tenho uma ideia de produto'], t: 'Dados, IA ou startup', s: 'LumiNex · BI, agentes de IA e MVP' },
    governo:  { nome: 'Agente Setor Público', area: 'Município, estado e União', ola: 'Olá! Sou o assistente virtual do Grupo LumiNex para o setor público. De qual órgão você fala e o que precisa?', chips: ['Sou de uma prefeitura', 'Sou de uma secretaria estadual', 'Sou de um órgão federal'], t: 'Sou do setor público', s: 'Município, estado e União' },
    seguranca: { nome: 'Agente Segurança', area: 'Segurança digital e LGPD', ola: 'Olá! Sou o assistente virtual de segurança do Grupo LumiNex. O que você quer proteger ou adequar?', chips: ['Revisar a segurança do meu site', 'Adequar à LGPD', 'Treinamento contra golpes'], t: 'Segurança digital', s: 'Auditoria, LGPD e treinamento' }
  };
  var ORDEM = ['lumivek', 'lumikode', 'luminex', 'governo', 'seguranca'];
  function wa(t) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(t); }
  function ev(n, p) { if (typeof gtag === 'function') gtag('event', n, p || {}); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  var ST = { agente: null, msgs: [], sessao: '', ok: false, n: 0, fim: false };
  try { var sv = JSON.parse(sessionStorage.getItem('lx_chat') || 'null'); if (sv) ST = Object.assign(ST, sv); } catch (e) {}
  if (!ST.sessao) ST.sessao = Math.random().toString(36).slice(2) + Date.now().toString(36);
  function salvar() { try { sessionStorage.setItem('lx_chat', JSON.stringify(ST)); } catch (e) {} }
  function padrao() {
    if (window.LX_AGENTE) return window.LX_AGENTE;
    var p = location.pathname.split('/').pop() || 'index.html';
    if (/governo/.test(p)) return 'governo'; if (/seguranca/.test(p)) return 'seguranca'; if (/automacao/.test(p)) return 'lumivek';
    if (/para-(clinicas|odontologia|restaurantes|escolas|lojas|transportadoras|turismo)/.test(p)) return 'lumivek';
    if (/para-(imobiliarias|construtoras|contabilidade)|orcamento|catalogo/.test(p)) return 'lumikode';
    return null;
  }

  var css = el('style');
  css.textContent = '#lxChatBtn{position:fixed;right:16px;bottom:84px;z-index:96;display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:999px;border:2px solid #D4AF37;background:#0A192F;color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
    '#lxChat{position:fixed;right:16px;bottom:140px;z-index:97;width:360px;max-width:calc(100vw - 24px);height:min(540px,calc(100vh - 170px));display:none;flex-direction:column;background:var(--surface,#0F2340);color:var(--text,#EAF1FA);border:1px solid var(--border,#1F4A78);border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.55);font:14px/1.45 system-ui,sans-serif;overflow:hidden}' +
    '#lxChat.open{display:flex}.lxc-h{display:flex;gap:8px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--border,#1F4A78)}.lxc-h div{flex:1;min-width:0}.lxc-h b{display:block}.lxc-h small{color:var(--text-dim,#90A3BC)}' +
    '.lxc-h button{background:none;border:1px solid var(--border,#1F4A78);color:inherit;border-radius:8px;padding:6px 9px;cursor:pointer;font:inherit;font-size:12px}' +
    '.lxc-b{flex:1;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px}.lxm{max-width:88%;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}.lxm.bot{background:var(--surface-2,#14305A);align-self:flex-start}.lxm.user{background:#D4AF37;color:#0A1319;align-self:flex-end}' +
    '.lxc-ch{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 8px}.lxc-ch button,.lxc-opt{background:transparent;border:1px solid var(--accent,#D4AF37);color:var(--accent,#D4AF37);border-radius:999px;padding:6px 11px;cursor:pointer;font:inherit;font-size:13px}' +
    '.lxc-opt{display:block;width:100%;text-align:left;border-radius:12px;color:inherit;border-color:var(--border,#1F4A78);padding:10px 12px;margin:0 0 8px}.lxc-opt small{display:block;color:var(--text-dim,#90A3BC)}' +
    '.lxc-f{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--border,#1F4A78)}.lxc-f input{flex:1;min-width:0;padding:10px 12px;border-radius:10px;border:1px solid var(--border,#1F4A78);background:var(--bg,#0A192F);color:inherit;font:inherit}.lxc-f button{padding:10px 14px;border-radius:10px;border:0;background:#D4AF37;color:#0A1319;font-weight:700;cursor:pointer}' +
    '.lxc-n{padding:0 14px 10px;color:var(--text-dim,#90A3BC);font-size:11.5px}.lxc-n a{color:var(--accent,#D4AF37)}.lxc-wa{display:inline-block;margin-top:6px;padding:9px 14px;border-radius:10px;background:#25D366;color:#fff;text-decoration:none;font-weight:700}' +
    '.sr{position:absolute;left:-9999px}@media (max-width:520px){#lxChat{left:8px;right:8px;top:8px;bottom:8px;width:auto;height:auto;max-width:none}#lxChatBtn span{display:none}}' +
    '#lxOpen{position:fixed;inset:0;z-index:130;background:rgba(3,10,20,.62);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.lxo-card{width:100%;max-width:560px;background:var(--surface,#0F2340);color:var(--text,#EAF1FA);border:1px solid var(--border,#1F4A78);border-radius:18px;padding:22px;font:15px/1.5 system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    '.lxo-logo{width:100%;max-height:150px;object-fit:cover;object-position:50% 40%;border-radius:12px;margin-bottom:14px}.lxo-card h2{margin:0 0 4px;font-size:22px}.lxo-card p{margin:0 0 14px;color:var(--text-dim,#90A3BC)}.lxo-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.lxo-grid button{text-align:left;background:var(--surface-2,#14305A);color:inherit;border:1px solid var(--border,#1F4A78);border-radius:12px;padding:11px 12px;cursor:pointer;font:inherit}.lxo-grid button:hover{border-color:#D4AF37}.lxo-grid small{display:block;color:var(--text-dim,#90A3BC);font-size:12px}' +
    '.lxo-row{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:14px}.lxo-row a{color:var(--accent,#D4AF37)}.lxo-row button{background:none;border:0;color:var(--text-dim,#90A3BC);text-decoration:underline;cursor:pointer;font:inherit}@media (max-width:520px){.lxo-grid{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  var btn = el('button'); btn.id = 'lxChatBtn'; btn.type = 'button'; btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-controls', 'lxChat'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span aria-hidden="true">💬</span><span>Fale com o agente</span>'; btn.setAttribute('aria-label', 'Abrir conversa com o assistente virtual');
  var box = el('div'); box.id = 'lxChat'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Conversa com o assistente virtual');
  box.innerHTML = '<div class="lxc-h"><div><b id="lxcNome"></b><small id="lxcArea"></small></div><button type="button" id="lxcTroca">Trocar assunto</button><button type="button" id="lxcX" aria-label="Fechar conversa">✕</button></div>' +
    '<div class="lxc-b" id="lxcCorpo" role="log" aria-live="polite"></div><div class="lxc-ch" id="lxcChips"></div>' +
    '<form class="lxc-f" id="lxcForm"><label class="sr" for="lxcIn">Sua mensagem</label><input id="lxcIn" maxlength="600" autocomplete="off" placeholder="Digite aqui..."><button type="submit">Enviar</button></form>' +
    '<div class="lxc-n">Assistente virtual com IA. Não envie senhas, documentos nem dados de saúde. <a href="' + ROOT + 'politica-de-privacidade.html">Privacidade</a></div>';
  document.body.appendChild(btn); document.body.appendChild(box);
  var corpo = box.querySelector('#lxcCorpo'), chips = box.querySelector('#lxcChips'), form = box.querySelector('#lxcForm'), inp = box.querySelector('#lxcIn');

  function add(who, txt) { var m = el('div', 'lxm ' + who, txt); corpo.appendChild(m); corpo.scrollTop = corpo.scrollHeight; return m; }
  function waBtn(txt) { var a = el('a', 'lxc-wa', 'Continuar no WhatsApp'); a.href = wa(txt); a.target = '_blank'; a.rel = 'noopener'; a.addEventListener('click', function () { ev('whatsapp_click', { origem: 'agente' }); }); corpo.appendChild(a); corpo.scrollTop = corpo.scrollHeight; }
  function ctx() { var a = AG[ST.agente]; return 'Olá! Vim pelo site e conversei com o ' + (a ? a.nome : 'assistente') + (a ? ' (' + a.area + ')' : '') + '. Gostaria de falar com uma pessoa.'; }

  function render() {
    corpo.innerHTML = ''; chips.innerHTML = ''; form.style.display = 'none';
    var a = AG[ST.agente];
    box.querySelector('#lxcNome').textContent = a ? a.nome : 'Assistente do Grupo LumiNex';
    box.querySelector('#lxcArea').textContent = a ? a.area : 'Escolha um assunto';
    if (!a) {   // escolha do assunto
      add('bot', 'Olá! Sobre o que você quer conversar?');
      ORDEM.forEach(function (id) { var o = el('button', 'lxc-opt'); o.type = 'button'; o.innerHTML = '<b></b><small></small>'; o.firstChild.textContent = AG[id].t; o.lastChild.textContent = AG[id].s; o.addEventListener('click', function () { escolher(id); }); corpo.appendChild(o); });
      return;
    }
    if (!ST.ok) {  // aviso e consentimento
      add('bot', 'Antes de começar: este atendimento é feito por um assistente virtual com inteligência artificial. As suas mensagens são processadas por serviços de IA para gerar as respostas. Se você pedir atendimento, guardamos o resumo do pedido e o seu contato. Não envie senhas, documentos nem dados de saúde.');
      var b = el('button', 'lxc-opt', 'Concordo e quero iniciar'); b.type = 'button'; b.addEventListener('click', function () { ST.ok = true; salvar(); ev('agente_inicio', { agente: ST.agente }); render(); }); corpo.appendChild(b);
      var p = el('a', 'lxc-wa', 'Prefiro o WhatsApp'); p.href = wa(ctx()); p.target = '_blank'; p.rel = 'noopener'; corpo.appendChild(p);
      return;
    }
    add('bot', a.ola);
    ST.msgs.forEach(function (m) { add(m.role === 'user' ? 'user' : 'bot', m.content); });
    if (ST.fim) { waBtn(ctx()); return; }
    form.style.display = 'flex';
    if (!ST.msgs.length) a.chips.forEach(function (c) { var x = el('button', null, c); x.type = 'button'; x.addEventListener('click', function () { enviar(c); }); chips.appendChild(x); });
    setTimeout(function () { inp.focus(); }, 50);
  }
  function escolher(id) { if (ST.agente !== id) { ST.agente = id; ST.msgs = []; ST.n = 0; ST.fim = false; } salvar(); render(); }

  function enviar(txt) {
    txt = (txt || '').trim(); if (!txt || ST.busy) return;
    if (ST.n >= 20) { add('bot', 'Chegamos ao limite desta conversa. Para continuar, fale com uma pessoa pelo WhatsApp.'); waBtn(ctx()); form.style.display = 'none'; return; }
    chips.innerHTML = ''; add('user', txt); ST.msgs.push({ role: 'user', content: txt.slice(0, 600) }); ST.n++; ST.busy = true; inp.value = ''; salvar();
    var tp = add('bot', 'Digitando...'); tp.setAttribute('aria-busy', 'true');
    var hdr = { 'Content-Type': 'application/json' };
    if (C.supabaseKey) { hdr.apikey = C.supabaseKey; if (/^eyJ/.test(C.supabaseKey)) hdr.Authorization = 'Bearer ' + C.supabaseKey; }
    fetch(URL_AG, { method: 'POST', headers: hdr, body: JSON.stringify({ agente: ST.agente, sessao: ST.sessao, mensagens: ST.msgs.slice(-20) }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        tp.remove(); ST.busy = false;
        if (!j || !j.resposta) throw new Error('vazio');
        add('bot', j.resposta); ST.msgs.push({ role: 'assistant', content: j.resposta });
        if (j.pedido) { ST.fim = true; form.style.display = 'none'; waBtn(ctx()); ev('agente_pedido', { agente: ST.agente }); }
        else if (j.erro || j.limite) { waBtn(ctx()); }
        salvar();
      })
      .catch(function () { tp.remove(); ST.busy = false; add('bot', 'Não consegui responder agora. Você pode falar direto pelo WhatsApp.'); waBtn(ctx()); });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); enviar(inp.value); });

  function abrir(id) {
    if (!URL_AG) { window.open(wa('Olá! Vim pelo site e gostaria de conversar' + (id && AG[id] ? ' sobre ' + AG[id].area.toLowerCase() : '') + '.'), '_blank'); return; }
    if (id) escolher(id); else if (!ST.agente) { var pd = padrao(); if (pd) escolher(pd); else render(); } else render();
    box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); ev('agente_abrir', { agente: ST.agente || 'escolha' });
  }
  function fechar() { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () { if (box.classList.contains('open')) fechar(); else abrir(); });
  box.querySelector('#lxcX').addEventListener('click', function () { fechar(); btn.focus(); });
  box.querySelector('#lxcTroca').addEventListener('click', function () { ST.agente = null; ST.msgs = []; ST.n = 0; ST.fim = false; salvar(); render(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) { fechar(); btn.focus(); } });
  window.LXAgente = { abrir: abrir };
  document.querySelectorAll('[data-agente]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); abrir(a.getAttribute('data-agente')); }); });

  // ---- Abertura: boas-vindas na página inicial (uma vez por visita, fácil de dispensar) ----
  function abertura() {
    if (C.aberturaAtiva === false || location.hash) return;
    if (!/(^|\/)(index\.html)?$/.test(location.pathname)) return;
    try { if (sessionStorage.getItem('lx_open')) return; sessionStorage.setItem('lx_open', '1'); } catch (e) {}
    setTimeout(mostrar, 700);
  }
  function mostrar() {
    var ov = el('div'); ov.id = 'lxOpen'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'lxOpenT');
    var card = el('div', 'lxo-card'); var im = el('img', 'lxo-logo'); im.src = ROOT + 'assets/logo-luminex.jpg'; im.alt = 'Grupo LumiNex'; im.onerror = function () { im.remove(); };
    card.appendChild(im); var h = el('h2', null, 'Bem-vindo ao Grupo LumiNex'); h.id = 'lxOpenT'; card.appendChild(h);
    card.appendChild(el('p', null, 'Software, automação e IA sob medida. Do que você precisa hoje?'));
    var g = el('div', 'lxo-grid'); ORDEM.forEach(function (id) { var b = el('button'); b.type = 'button'; b.innerHTML = '<b></b><small></small>'; b.firstChild.textContent = AG[id].t; b.lastChild.textContent = AG[id].s; b.addEventListener('click', function () { fecha(); abrir(id); }); g.appendChild(b); });
    card.appendChild(g);
    var row = el('div', 'lxo-row'); var a = el('a', null, 'Calcular orçamento'); a.href = ROOT + 'orcamento.html'; var x = el('button', null, 'Só quero explorar o site'); x.type = 'button'; x.addEventListener('click', fecha);
    row.appendChild(a); row.appendChild(x); card.appendChild(row); ov.appendChild(card); document.body.appendChild(ov);
    var ant = document.activeElement; var foc = card.querySelectorAll('button,a');
    function fecha() { ov.remove(); document.removeEventListener('keydown', tecla); if (ant && ant.focus) ant.focus(); }
    function tecla(e) { if (e.key === 'Escape') fecha(); else if (e.key === 'Tab') { var f = card.querySelectorAll('button,a'), p = f[0], u = f[f.length - 1]; if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); } else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); } } }
    ov.addEventListener('click', function (e) { if (e.target === ov) fecha(); }); document.addEventListener('keydown', tecla);
    if (foc[0]) foc[0].focus(); ev('abertura_vista');
  }
  abertura();
})();
