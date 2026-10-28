(function () {
  var C = window.LUMINEX || {};
  var K = 'lgpd_cookies';
  // Analytics só com aceite (Consent Mode)
  if (C.ga) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
    try { if (localStorage.getItem(K) === 'ok') gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ga; document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', C.ga, { anonymize_ip: true });
  }
  var LX = window.LX = {
    wa: function (t) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(t); },
    evento: function (n, p) { if (typeof gtag === 'function') gtag('event', n, p || {}); },
    lead: function (d) {
      if (!C.supabaseUrl || !C.supabaseKey) return;
      var p = new URLSearchParams(location.search), utm = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'].forEach(function (k) { if (p.get(k)) utm[k] = p.get(k).slice(0, 60); });
      d.pagina = location.pathname.slice(0, 200); d.utm = utm; d.consentimento = true;
      fetch(C.supabaseUrl.replace(/\/$/, '') + '/rest/v1/leads', { method: 'POST', headers: { apikey: C.supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(d), keepalive: true }).catch(function () {});
    }
  };
  // Botões de WhatsApp: data-wa="texto da mensagem"
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = LX.wa(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () { LX.evento('whatsapp_click', { pagina: location.pathname }); });
  });
  // Rodapé legal
  var lg = document.getElementById('legalLine');
  if (lg && (C.cnpj || C.cidadeUF)) { lg.textContent = [C.cnpj ? 'CNPJ ' + C.cnpj : '', C.cidadeUF].filter(Boolean).join(' · '); lg.hidden = false; }
  // Aviso de cookies
  var v = null; try { v = localStorage.getItem(K); } catch (e) {}
  if (!v && C.ga) {
    var b = document.createElement('div'); b.id = 'cookieBar'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML = '<p>Usamos cookies de métricas (Google Analytics) apenas se você aceitar, para entender como o site é usado. <a href="' + (window.LX_ROOT || '') + 'politica-de-privacidade.html">Política de Privacidade</a></p><div><button class="ok" type="button">Aceitar</button> <button class="no" type="button">Recusar</button></div>';
    document.body.appendChild(b);
    var set = function (x) { try { localStorage.setItem(K, x); } catch (e) {} b.remove(); if (x === 'ok' && typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' }); };
    b.querySelector('.ok').onclick = function () { set('ok'); }; b.querySelector('.no').onclick = function () { set('no'); };
  }
  // Formulários de pedido: <form data-lead data-segmento="" data-servico="">
  document.querySelectorAll('form[data-lead]').forEach(function (f) {
    var msg = f.querySelector('.form-msg');
    function erro(t) { msg.textContent = t; msg.className = 'form-msg err'; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = f.elements;
      if (el._gotcha && el._gotcha.value) return;
      var nome = el.nome.value.trim(), whats = el.whats.value.trim();
      var cidade = el.cidade ? el.cidade.value.trim() : '', texto = el.mensagem ? el.mensagem.value.trim() : '';
      if (nome.length < 2) return erro('Digite seu nome.');
      if (whats.replace(/\D/g, '').length < 10) return erro('Digite um WhatsApp válido, com DDD.');
      if (!el.consent.checked) return erro('Marque a caixa de consentimento para continuar.');
      var serv = f.getAttribute('data-servico') || '', resumo = f.getAttribute('data-resumo') || '';
      var t = 'Olá! Vim pelo site (' + document.title.split(' · ')[0] + ').\nNome: ' + nome + '\nWhatsApp: ' + whats +
        (cidade ? '\nCidade: ' + cidade : '') + (serv ? '\nInteresse: ' + serv : '') + (resumo ? '\n' + resumo : '') + (texto ? '\nMensagem: ' + texto : '');
      var url = LX.wa(t), w = window.open(url, '_blank');   // abre na hora, dentro do clique
      if (!w) location.href = url;
      LX.lead({ nome: nome, whatsapp: whats, cidade: cidade, segmento: f.getAttribute('data-segmento') || '', servico: serv.slice(0, 80), mensagem: ((resumo ? resumo + '\n' : '') + texto).slice(0, 1500) });
      LX.evento('generate_lead', { method: 'formulario', pagina: location.pathname });
      msg.textContent = 'Abrindo o WhatsApp para finalizar o contato...'; msg.className = 'form-msg ok';
      f.reset();
    });
  });
})();
