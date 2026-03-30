/* ═══════════════════════════════════════════════════════════
   SENAI · EASA — app.js
   Lógica da aplicação.
   Estrutura:
     1. Navegação
     2. Tema
     3. Fórmulas (tooltips)
     4. Calculadoras
     5. Flashcards
     6. Quiz
     7. Updates (renderização)
     8. Init
═══════════════════════════════════════════════════════════ */

/* ── 0. SEGURANÇA — helpers ──────────────────────────────── */

/** Escapa caracteres HTML especiais para uso seguro em innerHTML */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Páginas válidas — whitelist contra injeção via location.hash */
const VALID_PAGES = [
  'dashboard','fund-eletrica','cc','kirchhoff','ca',
  'semicond','transistor','tiristor','opto','retificador',
  'amp','filtros','rcrl','numeracao','logica','conv',
  'formulas','calc','flashcards','quiz','updates'
];

/* ── 1. NAVEGAÇÃO ────────────────────────────────────────── */

/**
 * Navega para uma página.
 * @param {string}  pg          - chave da página (ex: 'cc', 'dashboard')
 * @param {Element} el          - elemento .nav-item que foi clicado (para marcar active)
 * @param {boolean} pushHistory - false quando chamado pelo popstate (voltar)
 */
function goTo(pg, el, pushHistory = true) {
  // Esconde todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Ativa a página alvo
  const target = document.getElementById('pg-' + pg);
  if (target) target.classList.add('active');

  // Atualiza item ativo na sidebar
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Atualiza título no topbar (pg já foi validado via VALID_PAGES antes de goTo ser chamado)
  const raw = PAGE_TITLES[pg] || esc(pg);
  const titleEl = document.getElementById('page-title');
  titleEl.innerHTML = '';
  raw.split('·').forEach((part, i) => {
    if (i > 0) { const sp = document.createElement('span'); sp.textContent = '·'; titleEl.appendChild(sp); }
    titleEl.appendChild(document.createTextNode(part));
  });

  // Scroll para o topo (funciona dentro de iframe no mobile)
  const main = document.querySelector('.main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);

  // Fecha a sidebar se estiver aberta (mobile)
  closeSidebar();

  // Registra estado no histórico do navegador
  // Isso faz o botão "voltar" do mobile navegar entre páginas do app
  if (pushHistory) {
    history.pushState({ page: pg }, '', '#' + pg);
  }
}

/* ── 1b. BOTÃO VOLTAR DO MOBILE (popstate) ──────────────── */
window.addEventListener('popstate', function (e) {
  // Recupera a página do estado salvo (ou vai para dashboard)
  const rawPg = (e.state && e.state.page) ? e.state.page : 'dashboard';
  const pg = VALID_PAGES.includes(rawPg) ? rawPg : 'dashboard';

  // Encontra o nav-item correspondente via data-page (seguro)
  const navEl = document.querySelector('.nav-item[data-page="' + pg + '"]');

  // Navega sem empurrar novo estado (evita loop)
  goTo(pg, navEl, false);
});

/* ── 1c. MENU MOBILE (hamburguer) ───────────────────────── */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen  = sidebar.classList.contains('open');

  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // trava scroll do fundo enquanto menu abre
  }
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

/* Fecha sidebar ao pressionar Escape */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSidebar();
});

/* ── 2. TEMA ─────────────────────────────────────────────── */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-lbl').textContent = isDark ? 'LIGHT' : 'DARK';
}

/* ── 3. FÓRMULAS — TOOLTIPS ──────────────────────────────── */
function showTip(id) {
  const tip = document.getElementById('tip-' + id);
  if (!tip) return;

  // Fecha todos os outros tooltips do mesmo bloco
  const parent = tip.closest('.formula-display');
  parent.querySelectorAll('.tooltip-box').forEach(t => {
    if (t !== tip) t.classList.remove('show');
  });

  tip.classList.toggle('show');
}

/* ── 4. CALCULADORAS ─────────────────────────────────────── */

/** Formata número: inteiro sem casas, decimal sem zeros finais */
function fmt(n) {
  if (!isFinite(n)) return '⚠ Divisão por zero';
  return n % 1 === 0 ? n.toString() : n.toFixed(4).replace(/\.?0+$/, '');
}

/** Exibe resultado num elemento pelo id */
function setResult(id, text) {
  document.getElementById(id).textContent = text;
}

/** Lei de Ohm — V = I × R (resolve a incógnita) */
function calcOhm() {
  const v = parseFloat(document.getElementById('ohm-v').value);
  const i = parseFloat(document.getElementById('ohm-i').value);
  const r = parseFloat(document.getElementById('ohm-r').value);

  let res;
  if (!isNaN(v) && !isNaN(i) && isNaN(r))   res = 'R = ' + fmt(v / i) + ' Ω';
  else if (!isNaN(v) && isNaN(i) && !isNaN(r)) res = 'I = ' + fmt(v / r) + ' A';
  else if (isNaN(v) && !isNaN(i) && !isNaN(r)) res = 'V = ' + fmt(i * r) + ' V';
  else res = 'Deixe exatamente 1 campo vazio';

  setResult('res-ohm', res);
}

/** Potência — P = V × I */
function calcPot() {
  const v = parseFloat(document.getElementById('pot-v').value);
  const i = parseFloat(document.getElementById('pot-i').value);
  if (isNaN(v) || isNaN(i)) { setResult('res-pot', 'Preencha V e I'); return; }
  setResult('res-pot', 'P = ' + fmt(v * i) + ' W');
}

/** Resistores em série — RT = R1 + R2 + R3 */
function calcSerie() {
  const r1 = parseFloat(document.getElementById('s-r1').value) || 0;
  const r2 = parseFloat(document.getElementById('s-r2').value) || 0;
  const r3 = parseFloat(document.getElementById('s-r3').value) || 0;
  setResult('res-serie', 'RT = ' + fmt(r1 + r2 + r3) + ' Ω');
}

/** Resistores em paralelo — Req = (R1×R2)/(R1+R2) */
function calcPar() {
  const r1 = parseFloat(document.getElementById('p-r1').value);
  const r2 = parseFloat(document.getElementById('p-r2').value);
  if (isNaN(r1) || isNaN(r2)) { setResult('res-par', 'Preencha R1 e R2'); return; }
  setResult('res-par', 'Req = ' + fmt((r1 * r2) / (r1 + r2)) + ' Ω');
}

/** Resistor para LED — R = (VCC - VLED) / ILED */
function calcLED() {
  const vcc  = parseFloat(document.getElementById('led-vcc').value);
  const vled = parseFloat(document.getElementById('led-vled').value);
  const iled = parseFloat(document.getElementById('led-i').value) / 1000; // mA → A
  if ([vcc, vled, iled].some(isNaN)) { setResult('res-led', 'Preencha todos'); return; }
  setResult('res-led', 'R = ' + fmt((vcc - vled) / iled) + ' Ω');
}

/** Divisor de tensão — Vout = Vin × R2 / (R1+R2) */
function calcDiv() {
  const vin = parseFloat(document.getElementById('div-vin').value);
  const r1  = parseFloat(document.getElementById('div-r1').value);
  const r2  = parseFloat(document.getElementById('div-r2').value);
  if ([vin, r1, r2].some(isNaN)) { setResult('res-div', 'Preencha todos'); return; }
  setResult('res-div', 'Vout = ' + fmt(vin * r2 / (r1 + r2)) + ' V');
}

/* ── 5. FLASHCARDS ───────────────────────────────────────── */
let cardIndex  = 0;
let cardFlipped = false;

function renderCard(idx) {
  const c = FLASHCARDS[idx];
  document.getElementById('fc-q').textContent       = c.q;
  document.getElementById('fc-a').textContent       = c.a;
  document.getElementById('fc-s').textContent       = c.s;
  document.getElementById('fc-counter').textContent = (idx + 1) + ' / ' + FLASHCARDS.length;
  document.getElementById('fc-card').classList.remove('flipped');
  cardFlipped = false;
}

function flipCard() {
  document.getElementById('fc-card').classList.toggle('flipped');
  cardFlipped = !cardFlipped;
}

function nextCard() {
  cardIndex = (cardIndex + 1) % FLASHCARDS.length;
  renderCard(cardIndex);
}

function prevCard() {
  cardIndex = (cardIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
  renderCard(cardIndex);
}

/* ── 6. QUIZ ─────────────────────────────────────────────── */
let quizIndex    = 0;
let quizScore    = 0;
let quizAnswered = false;

function renderQuestion() {
  const d    = QUIZ_DATA[quizIndex];
  const pct  = (quizIndex / QUIZ_DATA.length) * 100;

  document.getElementById('quiz-q').innerHTML          = esc(d.q);
  document.getElementById('qbar').style.width          = pct + '%';
  document.getElementById('qcount').textContent        = (quizIndex + 1) + '/' + QUIZ_DATA.length;
  document.getElementById('quiz-fb').className         = 'quiz-feedback';
  document.getElementById('quiz-next').className       = 'quiz-next';

  // Renderiza opções
  const container = document.getElementById('quiz-opts');
  container.innerHTML = '';
  d.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-opt';
    btn.textContent = String.fromCharCode(65 + idx) + ') ' + opt;
    btn.onclick     = () => answerQuestion(idx);
    container.appendChild(btn);
  });

  quizAnswered = false;
}

function answerQuestion(idx) {
  if (quizAnswered) return;
  quizAnswered = true;

  const d    = QUIZ_DATA[quizIndex];
  const opts = document.querySelectorAll('.quiz-opt');

  // Marca certo/errado
  opts.forEach((btn, i) => {
    if (i === d.ans)  btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });

  // Feedback
  const fb = document.getElementById('quiz-fb');
  if (idx === d.ans) {
    quizScore++;
    fb.className = 'quiz-feedback ok show';
    fb.innerHTML = '✓ Correto! ' + esc(d.exp);
    document.getElementById('qscore').textContent = '✓ ' + quizScore;
  } else {
    fb.className = 'quiz-feedback fail show';
    fb.innerHTML = '✗ Incorreto. ' + esc(d.exp);
  }

  document.getElementById('quiz-next').className = 'quiz-next show';
}

function nextQuestion() {
  quizIndex++;

  if (quizIndex >= QUIZ_DATA.length) {
    // Tela de resultado final
    document.getElementById('quiz-q').innerHTML =
      '🎉 Quiz finalizado! Você acertou <strong style="color:var(--accent2)">' +
      quizScore + ' de ' + QUIZ_DATA.length + '</strong> questões.';
    document.getElementById('quiz-opts').innerHTML =
      '<button class="quiz-opt" onclick="restartQuiz()">↺ Reiniciar Quiz</button>';
    document.getElementById('quiz-fb').className   = 'quiz-feedback';
    document.getElementById('quiz-next').className = 'quiz-next';
    document.getElementById('qbar').style.width    = '100%';
    return;
  }

  renderQuestion();
}

function restartQuiz() {
  quizIndex  = 0;
  quizScore  = 0;
  document.getElementById('qscore').textContent = '✓ 0';
  renderQuestion();
}

/* ── 7. UPDATES — RENDERIZAÇÃO ───────────────────────────── */
function renderUpdates() {
  const container = document.getElementById('updates-list');
  if (!container) return;

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

/* ── 8. INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCard(0);
  renderQuestion();
  renderUpdates();

  // Suporte ao botão voltar: define o estado inicial no histórico
  // Se vier com hash na URL (ex: #cc), abre direto naquela página
  const rawHash = location.hash.replace('#', '');
  const hash = VALID_PAGES.includes(rawHash) ? rawHash : null;
  if (hash && document.getElementById('pg-' + hash)) {
    const navEl = document.querySelector('.nav-item[data-page="' + hash + '"]');
    goTo(hash, navEl, false);                           // abre a página
    history.replaceState({ page: hash }, '', '#' + hash); // registra sem duplicar
  } else {
    // Página inicial = dashboard; grava no histórico para poder voltar a ele
    history.replaceState({ page: 'dashboard' }, '', '#dashboard');
  }
/* Escuta sync de tema vindo do portal */
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'senai-theme-sync') {
    document.documentElement.dataset.theme = e.data.theme;
  }
});
});
