'use strict';
/* ════════════════════════════════════════════════════════════════
   SENAI · EASA — app.js  v2.2
   ─────────────────────────────────────────────────────────────
   MUDANÇAS v2.2 (rastreadas pelo Code Review):
   ① var → const/let em todo o arquivo
   ② postMessage: verifica e.origin antes de processar
   ③ Event delegation na sidebar — remove onclick do HTML
   ④ innerHTML gerado via template só com dados escapados (esc())
   ⑤ Tema: usa [data-theme] exclusivamente (não mais classe .light)
   ⑥ Botão voltar (popstate) com whitelist VALID_PAGES
   ════════════════════════════════════════════════════════════════ */


/* ── 0. SEGURANÇA — helpers ─────────────────────────────────── */

/** Escapa caracteres HTML para uso seguro em innerHTML */
function esc(s) {
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/** Páginas válidas — whitelist contra injeção via location.hash */
const VALID_PAGES = [
  'dashboard','fund-eletrica','cc','kirchhoff','ca',
  'semicond','transistor','tiristor','opto','retificador',
  'amp','filtros','rcrl','numeracao','logica','conv',
  'formulas','calc','flashcards','quiz','updates',
];


/* ── 1. NAVEGAÇÃO ───────────────────────────────────────────── */

/**
 * Navega para uma página.
 * @param {string} pg           - chave da página (ex: 'cc')
 * @param {Element|null} el     - .nav-item clicado (para active)
 * @param {boolean} pushHistory - false quando chamado pelo popstate
 */
function goTo(pg, el = null, pushHistory = true) {
  /* ③ Valida antes de usar — nunca confia em dado externo */
  const safePg = VALID_PAGES.includes(pg) ? pg : 'dashboard';

  /* Esconde todas as páginas */
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  /* Ativa a página alvo */
  document.getElementById('pg-' + safePg)?.classList.add('active');

  /* Atualiza item ativo na sidebar */
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el?.classList.add('active');

  /* Atualiza título no topbar (④ textContent — sem XSS) */
  const raw     = PAGE_TITLES[safePg] ?? safePg;
  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    titleEl.textContent = '';
    raw.split('·').forEach((part, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.textContent = '·';
        titleEl.appendChild(sep);
      }
      titleEl.appendChild(document.createTextNode(part));
    });
  }

  /* Scroll para o topo */
  document.querySelector('.main')?.scrollTo(0, 0);
  window.scrollTo(0, 0);

  /* Fecha sidebar mobile */
  closeSidebar();

  /* Registra no histórico */
  if (pushHistory) history.pushState({ page: safePg }, '', '#' + safePg);
}
window.goTo = goTo;

/* ── 1b. BOTÃO VOLTAR (popstate) ────────────────────────────── */
window.addEventListener('popstate', e => {
  /* ⑥ Whitelist — rejeita hashes inválidos */
  const rawPg = e.state?.page ?? '';
  const pg    = VALID_PAGES.includes(rawPg) ? rawPg : 'dashboard';
  const navEl = document.querySelector(`.nav-item[data-page="${pg}"]`);
  goTo(pg, navEl, false);
});


/* ── 1c. SIDEBAR MOBILE ─────────────────────────────────────── */
function toggleSidebar() {
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const isOpen   = sidebar?.classList.contains('open');
  isOpen ? closeSidebar() : openSidebar();
}

function openSidebar() {
  document.querySelector('.sidebar')?.classList.add('open');
  document.getElementById('sidebar-overlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

/* Navegação — sidebar e cards do dashboard */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-page]');
    if (!item) return;
    const pg = item.dataset.page;
    if (!VALID_PAGES.includes(pg)) return;
    const navEl = document.querySelector(`.nav-item[data-page="${pg}"]`);
    goTo(pg, navEl);
  });
});

/* ── 2. TEMA ────────────────────────────────────────────────── */
/* ⑤ Usa dataset.theme exclusivamente — sem classe .light        */
function toggleTheme() {
  const html    = document.documentElement;
  const isDark  = html.dataset.theme !== 'light';
  const newTheme = isDark ? 'light' : 'dark';
  html.dataset.theme = newTheme;
  localStorage.setItem('easa-theme', newTheme);
  const lbl = document.getElementById('theme-lbl');
  if (lbl) lbl.textContent = isDark ? 'LIGHT' : 'DARK';
}

/* Restaura tema salvo */
(function initTheme() {
  const saved = localStorage.getItem('easa-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
    const lbl = document.getElementById('theme-lbl');
    if (lbl) lbl.textContent = saved === 'light' ? 'LIGHT' : 'DARK';
  }
})();


/* ── 3. FÓRMULAS — TOOLTIPS ─────────────────────────────────── */
function showTip(id) {
  const tip    = document.getElementById('tip-' + id);
  if (!tip) return;
  const parent = tip.closest('.formula-display');
  parent?.querySelectorAll('.tooltip-box').forEach(t => {
    if (t !== tip) t.classList.remove('show');
  });
  tip.classList.toggle('show');
}


/* ── 4. CALCULADORAS ────────────────────────────────────────── */
/** Formata número sem zeros finais */
function fmt(n) {
  if (!isFinite(n)) return '⚠ Divisão por zero';
  return n % 1 === 0 ? n.toString() : n.toFixed(4).replace(/\.?0+$/, '');
}

function setResult(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function calcOhm() {
  const v = parseFloat(document.getElementById('ohm-v').value);
  const i = parseFloat(document.getElementById('ohm-i').value);
  const r = parseFloat(document.getElementById('ohm-r').value);
  let res;
  if (!isNaN(v) && !isNaN(i) && isNaN(r))       res = 'R = ' + fmt(v / i) + ' Ω';
  else if (!isNaN(v) && isNaN(i) && !isNaN(r))   res = 'I = ' + fmt(v / r) + ' A';
  else if (isNaN(v) && !isNaN(i) && !isNaN(r))   res = 'V = ' + fmt(i * r) + ' V';
  else                                             res = 'Deixe exatamente 1 campo vazio';
  setResult('res-ohm', res);
}

function calcPot() {
  const v = parseFloat(document.getElementById('pot-v').value);
  const i = parseFloat(document.getElementById('pot-i').value);
  if (isNaN(v) || isNaN(i)) { setResult('res-pot', 'Preencha V e I'); return; }
  setResult('res-pot', 'P = ' + fmt(v * i) + ' W');
}

function calcSerie() {
  const r1 = parseFloat(document.getElementById('s-r1').value) || 0;
  const r2 = parseFloat(document.getElementById('s-r2').value) || 0;
  const r3 = parseFloat(document.getElementById('s-r3').value) || 0;
  setResult('res-serie', 'RT = ' + fmt(r1 + r2 + r3) + ' Ω');
}

function calcPar() {
  const r1 = parseFloat(document.getElementById('p-r1').value);
  const r2 = parseFloat(document.getElementById('p-r2').value);
  if (isNaN(r1) || isNaN(r2)) { setResult('res-par', 'Preencha R1 e R2'); return; }
  setResult('res-par', 'Req = ' + fmt((r1 * r2) / (r1 + r2)) + ' Ω');
}

function calcLED() {
  const vcc  = parseFloat(document.getElementById('led-vcc').value);
  const vled = parseFloat(document.getElementById('led-vled').value);
  const iled = parseFloat(document.getElementById('led-i').value) / 1000;
  if ([vcc, vled, iled].some(isNaN)) { setResult('res-led', 'Preencha todos'); return; }
  setResult('res-led', 'R = ' + fmt((vcc - vled) / iled) + ' Ω');
}

function calcDiv() {
  const vin = parseFloat(document.getElementById('div-vin').value);
  const r1  = parseFloat(document.getElementById('div-r1').value);
  const r2  = parseFloat(document.getElementById('div-r2').value);
  if ([vin, r1, r2].some(isNaN)) { setResult('res-div', 'Preencha todos'); return; }
  setResult('res-div', 'Vout = ' + fmt(vin * r2 / (r1 + r2)) + ' V');
}


/* ── 5. FLASHCARDS ──────────────────────────────────────────── */
let cardIndex   = 0;
let cardFlipped = false;

function renderCard(idx) {
  const c = FLASHCARDS[idx];
  if (!c) return;
  /* ④ textContent — nunca innerHTML com dados externos */
  document.getElementById('fc-q').textContent       = c.q;
  document.getElementById('fc-a').textContent       = c.a;
  document.getElementById('fc-s').textContent       = c.s;
  document.getElementById('fc-counter').textContent = `${idx + 1} / ${FLASHCARDS.length}`;
  document.getElementById('fc-card')?.classList.remove('flipped');
  cardFlipped = false;
}

function flipCard()  { document.getElementById('fc-card')?.classList.toggle('flipped'); cardFlipped = !cardFlipped; }
function nextCard()  { cardIndex = (cardIndex + 1) % FLASHCARDS.length; renderCard(cardIndex); }
function prevCard()  { cardIndex = (cardIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length; renderCard(cardIndex); }


/* ── 6. QUIZ ─────────────────────────────────────────────────  */
let quizIndex    = 0;
let quizScore    = 0;
let quizAnswered = false;

function renderQuestion() {
  const d   = QUIZ_DATA[quizIndex];
  const pct = (quizIndex / QUIZ_DATA.length) * 100;

  /* ④ Usa textContent onde possível — esc() onde precisa de HTML */
  document.getElementById('quiz-q').textContent      = d.q;
  document.getElementById('qbar').style.width        = pct + '%';
  document.getElementById('qcount').textContent      = `${quizIndex + 1}/${QUIZ_DATA.length}`;
  document.getElementById('quiz-fb').className       = 'quiz-feedback';
  document.getElementById('quiz-next').className     = 'quiz-next';

  const container = document.getElementById('quiz-opts');
  container.innerHTML = '';
  d.opts.forEach((opt, idx) => {
    const btn       = document.createElement('button');
    btn.className   = 'quiz-opt';
    btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
    btn.addEventListener('click', () => answerQuestion(idx));
    container.appendChild(btn);
  });

  quizAnswered = false;
}

function answerQuestion(idx) {
  if (quizAnswered) return;
  quizAnswered = true;
  const d    = QUIZ_DATA[quizIndex];
  const opts = document.querySelectorAll('.quiz-opt');

  opts.forEach((btn, i) => {
    if (i === d.ans) btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });

  const fb = document.getElementById('quiz-fb');
  if (idx === d.ans) {
    quizScore++;
    fb.className = 'quiz-feedback ok show';
  } else {
    fb.className = 'quiz-feedback fail show';
  }
  /* ④ Explicação via textContent — nenhuma interpolação de HTML */
  fb.textContent = (idx === d.ans ? '✓ Correto! ' : '✗ Incorreto. ') + d.exp;
  document.getElementById('qscore').textContent = '✓ ' + quizScore;
  document.getElementById('quiz-next').className = 'quiz-next show';
}

function nextQuestion() {
  quizIndex++;
  if (quizIndex >= QUIZ_DATA.length) {
    /* Tela de resultado — sem innerHTML com dados externos */
    const qEl = document.getElementById('quiz-q');
    qEl.textContent = '';

    const msg = document.createElement('p');
    const strong = document.createElement('strong');
    strong.style.color = 'var(--accent2)';
    strong.textContent = `${quizScore} de ${QUIZ_DATA.length}`;
    msg.appendChild(document.createTextNode('🎉 Quiz finalizado! Você acertou '));
    msg.appendChild(strong);
    msg.appendChild(document.createTextNode(' questões.'));
    qEl.appendChild(msg);

    const optsEl = document.getElementById('quiz-opts');
    optsEl.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.className   = 'quiz-opt';
    restartBtn.textContent = '↺ Reiniciar Quiz';
    restartBtn.addEventListener('click', restartQuiz);
    optsEl.appendChild(restartBtn);

    document.getElementById('quiz-fb').className  = 'quiz-feedback';
    document.getElementById('quiz-next').className = 'quiz-next';
    document.getElementById('qbar').style.width   = '100%';
    return;
  }
  renderQuestion();
}

function restartQuiz() {
  quizIndex = 0;
  quizScore = 0;
  document.getElementById('qscore').textContent = '✓ 0';
  renderQuestion();
}


/* ── 7. UPDATES — RENDERIZAÇÃO ──────────────────────────────── */
function renderUpdates() {
  const container = document.getElementById('updates-list');
  if (!container) return;

  /* ④ Cada campo escapado com esc() antes de ir para innerHTML */
  container.innerHTML = UPDATES.map(u => `
    <div class="update-card ${esc(u.type)}">
      <div class="update-header">
        <div>
          <div class="update-version">${esc(u.version)}</div>
          <div class="update-title">${esc(u.title)}</div>
        </div>
        <div class="update-meta">
          <span class="update-date">${esc(u.date)}</span>
          <span class="update-status status-${esc(u.type)}">
            ${u.type === 'live' ? '● ATUAL' : u.type === 'upcoming' ? '◎ EM BREVE' : '○ PLANEJADO'}
          </span>
        </div>
      </div>
      <ul class="update-items">
        ${u.items.map(item => `<li>${esc(item)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}


/* ── 8. INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCard(0);
  renderQuestion();
  renderUpdates();

  /* Restaura página pelo hash */
  const rawHash = location.hash.replace('#', '');
  const hash    = VALID_PAGES.includes(rawHash) ? rawHash : null;

  if (hash && document.getElementById('pg-' + hash)) {
    const navEl = document.querySelector(`.nav-item[data-page="${hash}"]`);
    goTo(hash, navEl, false);
    history.replaceState({ page: hash }, '', '#' + hash);
  } else {
    history.replaceState({ page: 'dashboard' }, '', '#dashboard');
  }
});


/* ── 9. INTEGRAÇÃO COM PORTAL (iframe) ─────────────────────── */

/* Detecta embed e adiciona classe para ajustes de layout */
if (window.self !== window.top) {
  document.documentElement.classList.add('embedded');
}

/* ② Escuta sync de tema — verifica e.origin antes de processar */
window.addEventListener('message', e => {
  /* Rejeita mensagens de origens desconhecidas */
  if (e.origin !== window.location.origin) return;

  const { type, theme } = e.data ?? {};
  if (type !== 'senai-theme-sync') return;
  if (theme !== 'light' && theme !== 'dark') return;

  /* ⑤ Aplica via dataset.theme — sem classe .light */
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('easa-theme', theme);

  const lbl = document.getElementById('theme-lbl');
  if (lbl) lbl.textContent = theme === 'light' ? 'LIGHT' : 'DARK';
});
