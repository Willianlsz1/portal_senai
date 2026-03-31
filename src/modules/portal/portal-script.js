'use strict';
/* ════════════════════════════════════════════════════════════════
   SENAI PORTAL — portal-script.js  v2.0
   Substitui o bloco <script> inline do index.html raiz.

   CORREÇÕES aplicadas:
   ① Memory leak    → { once: true } no addEventListener
   ② postMessage    → window.location.origin (não mais '*')
   ③ var            → const/let
   ④ onclick inline → event delegation
   ⑤ Tema           → [data-theme] padronizado nos 3 apps
   ════════════════════════════════════════════════════════════════ */

const APPS = {
  mvf:  { src: 'senai-mvf/index.html', iframe: null, loader: null, loaded: false },
  easa: { src: 'easa/index.html',      iframe: null, loader: null, loaded: false },
};

/* Cache DOM */
(function cacheRefs() {
  for (const key in APPS) {
    APPS[key].iframe = document.getElementById('iframe-' + key);
    APPS[key].loader = document.getElementById(key + '-loader');
  }
})();

/* ── Lazy loading sem memory leak ────────────────────────── */
function loadApp(key) {
  const app    = APPS[key];
  if (app.loaded) return;
  const iframe = app.iframe;

  /* ① { once: true } — listener auto-removido após disparar */
  iframe.addEventListener('load', () => {
    app.loaded = true;
    app.loader?.classList.add('done');
    pushTheme(iframe);
  }, { once: true });

  iframe.src = app.src;
}

/* ── Troca de abas ───────────────────────────────────────── */
function switchApp(appId) {
  document.querySelectorAll('.tab').forEach(tab => {
    const active = tab.dataset.app === appId;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('visible'));
  document.getElementById('panel-' + appId)?.classList.add('visible');

  const btnExt = document.getElementById('btn-external');
  if (APPS[appId]) {
    btnExt.href = APPS[appId].src;
    btnExt.classList.add('visible');
  } else {
    btnExt.classList.remove('visible');
  }

  if (APPS[appId] && !APPS[appId].loaded) loadApp(appId);

  history.replaceState(null, '',
    appId === 'home' ? window.location.pathname : '#' + appId);
}

/* ── postMessage seguro ──────────────────────────────────── */
function pushTheme(iframe) {
  try {
    iframe.contentWindow?.postMessage(
      { type: 'senai-theme-sync', theme: document.documentElement.dataset.theme ?? 'dark' },
      window.location.origin   /* ② não mais '*' */
    );
  } catch (_) {}
}

function pushThemeToAll() {
  for (const key in APPS) {
    if (APPS[key].loaded) pushTheme(APPS[key].iframe);
  }
}

/* ── Tema ────────────────────────────────────────────────── */
function applyTheme(isLight) {
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  localStorage.setItem('senai-portal-theme', isLight ? 'light' : 'dark');
  updateThemeBtn();
  pushThemeToAll();
}
function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme !== 'light');
}
function updateThemeBtn() {
  const btn     = document.getElementById('theme-btn');
  const isLight = document.documentElement.dataset.theme === 'light';
  btn.textContent = isLight ? '☾' : '☀';
  btn.title       = isLight ? 'Tema escuro' : 'Tema claro';
}

(function initTheme() {
  const saved = localStorage.getItem('senai-portal-theme');
  if (saved === 'light' || saved === 'dark')
    document.documentElement.dataset.theme = saved;
  updateThemeBtn();
})();

/* ── Eventos — event delegation ─────────────────────────── */
document.getElementById('theme-btn').addEventListener('click', toggleTheme);

delegateNavigation(document.querySelector('[role="tablist"]'), '.tab[data-app]', tab => {
  switchApp(tab.dataset.app);
});

delegateNavigation(document.querySelector('.cards-grid'), '[data-target]', card => {
  switchApp(card.dataset.target);
});

/* ── Restaurar hash ──────────────────────────────────────── */
(function restoreFromHash() {
  const hash = window.location.hash.replace('#', '');
  switchApp(APPS[hash] ? hash : 'home');
})();

window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');
  switchApp(APPS[hash] ? hash : 'home');
});
