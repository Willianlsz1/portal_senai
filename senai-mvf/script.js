'use strict';
/* ════════════════════════════════════════════════════════════════
   SENAI · MVF v5 — script.js  (refatorado v5.5)
   ─────────────────────────────────────────────────────────────
   MUDANÇAS (rastreadas pelo Code Review):
   ① var → const/let em todo o arquivo
   ② Tema: remove classe .light — usa [data-theme] exclusivamente
      para uniformizar com o portal e o EASA
   ③ postMessage: verifica e.origin antes de processar
   ④ Event delegation na nav (substitui onclick no HTML)
   ⑤ Lógica de tema separada do init para facilitar manutenção
   ════════════════════════════════════════════════════════════════ */

/** Escapa caracteres HTML para uso seguro em innerHTML */
function esc(s) {
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/* ── § 1. NAVEGAÇÃO ──────────────────────────────────────────── */
const PAGES = [
  'home','m1','m2','m3','m4',
  'formulas','pressao','nivel','vazao','temperatura',
  'relacoes','cenarios',
  'calibracao','flash','quiz','calc','bernoulli','changelog',
];

/** Troca a tela ativa e rola o nav item para visível */
function S(id) {
  if (!PAGES.includes(id)) return; /* ignora ids inválidos */

  PAGES.forEach(p => {
    document.getElementById('screen-' + p)?.classList.remove('active');
    document.getElementById('nav-'    + p)?.classList.remove('active');
    document.getElementById('dnav-'   + p)?.classList.remove('active');
  });

  document.getElementById('screen-' + id)?.classList.add('active');

  const nv = document.getElementById('nav-' + id);
  if (nv) {
    nv.classList.add('active');
    nv.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  document.getElementById('dnav-' + id)?.classList.add('active');
  window.scrollTo(0, 0);
}

/** Nav bar: scroll horizontal (setas ‹ ›) */
function scrollNav(delta) {
  document.getElementById('navBar')?.scrollBy({ left: delta, behavior: 'smooth' });
}

/** Troca de tela + fecha drawer mobile */
function SD(id) { S(id); closeDrawer(); }

/** Drawer mobile (legacy — mantido para compatibilidade) */
function toggleDrawer() {
  document.getElementById('drawer')?.classList.toggle('open');
  document.getElementById('overlay')?.classList.toggle('open');
}
function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
}

/** Sidebar mobile */
function toggleMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('mobile-overlay');
  if (!sidebar) return;
  const open = sidebar.classList.toggle('open');
  overlay?.classList.toggle('show', open);
}
function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('mobile-overlay')?.classList.remove('show');
}

/* ④ Event delegation — substitui onclick="S('...')" em cada item */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.ds-sidebar-nav')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('.ds-nav-item[id^="nav-"]');
      if (!btn) return;
      const id = btn.id.replace('nav-', '');
      if (PAGES.includes(id)) S(id);
    });
});

/* ── § 2. TEMA CLARO/ESCURO ──────────────────────────────────── */
/* ② Remove uso de .light — usa [data-theme] exclusivamente       */

(function initTheme() {
  const saved = localStorage.getItem('mvf-theme');
  const root  = document.documentElement;
  /* Aplica somente via data-theme — sem classList.add('light') */
  root.dataset.theme = (saved === 'light') ? 'light' : 'dark';
  updateThemeBtn();
})();

function toggleTheme() {
  const root    = document.documentElement;
  const isLight = root.dataset.theme !== 'light';
  root.dataset.theme = isLight ? 'light' : 'dark';
  localStorage.setItem('mvf-theme', root.dataset.theme);
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn     = document.getElementById('theme-btn');
  if (!btn) return;
  const isLight = document.documentElement.dataset.theme === 'light';
  const icon    = btn.querySelector('.ds-theme-icon');
  const label   = btn.querySelector('.ds-theme-label');
  if (icon)  icon.textContent  = isLight ? '☾' : '☀';
  if (label) label.textContent = isLight ? 'Claro' : 'Escuro';
  btn.title = isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro';
}


/* ── § 3. UI HELPERS ─────────────────────────────────────────── */
function X(el)         { el.classList.toggle('open'); }
function toggleScen(el){ el.classList.toggle('open'); }


/* ── § 4. FLASHCARDS ENGINE ──────────────────────────────────── */
let fcActive = [...Array(CARDS.length).keys()];
let fcIdx    = 0;

function fcShow() {
  const i = fcActive[fcIdx];
  /* ① textContent — sem innerHTML com dados externos */
  document.getElementById('fccat').textContent  = CARDS[i].c;
  document.getElementById('fccatb').textContent = CARDS[i].c;
  document.getElementById('fcq').textContent    = CARDS[i].q;
  document.getElementById('fca').textContent    = CARDS[i].a;
  document.getElementById('fccnt').textContent  = `${fcIdx + 1} / ${fcActive.length}`;
  document.getElementById('fcprog').style.width =
    ((fcIdx + 1) / fcActive.length * 100).toFixed(1) + '%';
  document.getElementById('fccard')?.classList.remove('flip');
}

function fcFlip()    { document.getElementById('fccard')?.classList.toggle('flip'); }
function fcNext()    { fcIdx = (fcIdx + 1) % fcActive.length; fcShow(); }
function fcPrev()    { fcIdx = (fcIdx - 1 + fcActive.length) % fcActive.length; fcShow(); }
function fcShuffle() { fcActive = [...fcActive].sort(() => Math.random() - 0.5); fcIdx = 0; fcShow(); }
function fcReset()   { fcActive = [...Array(CARDS.length).keys()]; fcIdx = 0; fcShow(); }

function fcFilt(cat) {
  const f = CARDS.map((c, i) => c.c === cat ? i : -1).filter(i => i >= 0);
  fcActive = f.length ? f : [...Array(CARDS.length).keys()];
  fcIdx = 0;
  fcShow();
}

setTimeout(fcShow, 50);


/* ── § 5. QUIZ ENGINE ────────────────────────────────────────── */
let qzState = { q: [], idx: 0, score: 0, answered: false, total: 10 };

function startQz(n) {
  qzState.total = n;
  const s = [...QS].sort(() => Math.random() - 0.5).slice(0, n);
  qzState.q = s.map(q => {
    const ct = q.o[q.a];
    const so = [...q.o].sort(() => Math.random() - 0.5);
    return { ...q, o: so, a: so.indexOf(ct) };
  });
  qzState.idx = 0; qzState.score = 0; qzState.answered = false;
  renderQz();
}

function renderQz() {
  const qa = document.getElementById('qzarea');
  if (!qzState.q.length) return;

  if (qzState.idx >= qzState.q.length) {
    /* Tela de resultado — esc() em todos os dados */
    const pct   = Math.round(qzState.score / qzState.total * 100);
    const stars = pct >= 90 ? '★★★' : pct >= 70 ? '★★☆' : '★☆☆';
    const col   = pct >= 70 ? 'var(--g)' : 'var(--r)';
    const msg   = pct >= 90
      ? 'Excelente! Você dominou o conteúdo.'
      : pct >= 70
      ? 'Bom! Revise os pontos errados.'
      : 'Continue estudando os módulos.';

    qa.innerHTML = `
      <div class="score-wrap">
        <div style="font-size:24px;margin-bottom:8px">${stars}</div>
        <div class="score-big">${esc(String(qzState.score))}/${esc(String(qzState.total))}</div>
        <div style="font-size:13px;color:var(--t3);font-family:var(--fm);margin-top:5px">${esc(String(pct))}% de acertos</div>
        <div style="margin-top:14px;font-size:14px;color:${col}">${esc(msg)}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap">
          <button class="btn btn-p" id="qz-repeat-btn">Repetir (${esc(String(qzState.total))})</button>
          <button class="btn btn-g" id="qz-all-btn">Todas ${esc(String(QS.length))}</button>
        </div>
      </div>`;

    /* Event listeners — sem onclick inline */
    document.getElementById('qz-repeat-btn')?.addEventListener('click', () => startQz(qzState.total));
    document.getElementById('qz-all-btn')?.addEventListener('click', () => startQz(QS.length));
    document.getElementById('qzstat').textContent = `Concluído — ${qzState.score}/${qzState.total} acertos`;
    return;
  }

  const q = qzState.q[qzState.idx];
  document.getElementById('qzstat').textContent =
    `Q${qzState.idx + 1} de ${qzState.total} · Pontuação: ${qzState.score}`;

  /* Monta HTML com esc() em cada dado */
  qa.innerHTML = `
    <div class="qz-box">
      <div class="qz-meta">
        <span style="background:rgba(0,212,255,.1);color:var(--p);padding:2px 8px;border-radius:4px;font-family:var(--fm);font-size:10px">Q${esc(String(qzState.idx + 1))}</span>
        de ${esc(String(qzState.total))}
      </div>
      <div class="qz-q">${esc(q.q)}</div>
      ${q.o.map((o, i) => `
        <div class="qz-opt" id="qo${i}" data-opt="${i}" role="button" tabindex="0">
          <span class="qz-ltr">${String.fromCharCode(65 + i)}</span>${esc(o)}
        </div>`).join('')}
      <div id="qzfb" style="display:none"></div>
    </div>
    <div id="qznxt" style="display:none;margin-top:10px">
      <button class="btn btn-p" id="qz-next-btn">
        ${qzState.idx + 1 < qzState.total ? 'Próxima →' : 'Ver resultado'}
      </button>
    </div>`;

  /* ④ Event delegation — sem onclick em cada .qz-opt */
  qa.querySelector('.qz-box')?.addEventListener('click', e => {
    const opt = e.target.closest('.qz-opt[data-opt]');
    if (opt) answerQz(parseInt(opt.dataset.opt));
  });

  qa.querySelector('.qz-box')?.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const opt = e.target.closest('.qz-opt[data-opt]');
    if (opt) { e.preventDefault(); answerQz(parseInt(opt.dataset.opt)); }
  });

  document.getElementById('qz-next-btn')?.addEventListener('click', nextQz);
}

function answerQz(i) {
  if (qzState.answered) return;
  qzState.answered = true;
  const q = qzState.q[qzState.idx];

  document.querySelectorAll('.qz-opt').forEach(o => o.classList.add('dis'));
  document.getElementById('qo' + i)?.classList.add(i === q.a ? 'ok' : 'err');
  if (i !== q.a) document.getElementById('qo' + q.a)?.classList.add('ok');
  if (i === q.a) qzState.score++;

  const fb = document.getElementById('qzfb');
  if (fb) {
    fb.style.display = 'block';
    fb.className     = 'qz-fb ' + (i === q.a ? 'fb-ok' : 'fb-err');
    /* ④ textContent — explicação não vai para innerHTML */
    fb.textContent   = (i === q.a ? '✓ Correto — ' : '✗ Incorreto — ') + q.e;
  }

  if (document.getElementById('qznxt'))
    document.getElementById('qznxt').style.display = 'block';
}

function nextQz() {
  qzState.idx++;
  qzState.answered = false;
  renderQz();
}


/* ── § 6. CALCULADORA ────────────────────────────────────────── */
const C = {
  c1() {
    const a  = +document.getElementById('c1a').value || 0;
    const b  = +document.getElementById('c1b').value || 0;
    const ea = a - b, er = b ? ea / b : 0;
    document.getElementById('r1').textContent =
      `EA = ${ea >= 0 ? '+' : ''}${ea.toFixed(4)} → ${ea > 0 ? 'superestima' : ea < 0 ? 'subestima' : 'sem erro'} | ER = ${er.toFixed(5)}`;
  },

  c2() {
    const ea   = +document.getElementById('c2a').value || 0;
    const fs   = +document.getElementById('c2b').value || 1;
    const lrv  = +document.getElementById('c2c').value || 0;
    const span = fs - lrv;
    document.getElementById('r2').textContent =
      `%FS = ${(ea / fs * 100).toFixed(3)}% | Span = ${span.toFixed(2)} | %Span = ${span ? ((ea / span) * 100).toFixed(3) : '—'}%`;
  },

  c3() {
    const fs = +document.getElementById('c3a').value || 0;
    const p  = +document.getElementById('c3b').value || 0;
    document.getElementById('r3').textContent = `Erro máximo = ±${(fs * p / 100).toFixed(5)} unidades`;
  },

  c4() {
    const r  = +document.getElementById('c4a').value || 0;
    const g  = +document.getElementById('c4b').value || 9.81;
    const h  = +document.getElementById('c4c').value || 0;
    const dp = r * g * h;
    document.getElementById('r4').textContent =
      `ΔP = ${Math.round(dp).toLocaleString('pt-BR')} Pa = ${(dp / 100000).toFixed(5)} bar = ${(dp / 1000).toFixed(4)} kPa`;
  },

  c5() {
    const p = +document.getElementById('c5a').value || 1;
    const r = +document.getElementById('c5b').value || 1000;
    const g = +document.getElementById('c5c').value || 9.81;
    document.getElementById('r5').textContent = `h = ${(p / (r * g)).toFixed(4)} m`;
  },

  c6() {
    const r  = +document.getElementById('c6a').value || 0;
    const v  = +document.getElementById('c6b').value || 0;
    const d  = +document.getElementById('c6c').value || 0;
    const u  = +document.getElementById('c6d').value || 0.001;
    const re = u ? r * v * d / u : 0;
    const reg = re < 2300 ? 'LAMINAR' : re < 4000 ? 'TRANSIÇÃO' : 'TURBULENTO';
    document.getElementById('r6').textContent = `Re = ${Math.round(re).toLocaleString('pt-BR')} → ${reg}`;
  },

  c7() {
    const h = +document.getElementById('c7a').value || 0;
    const g = +document.getElementById('c7b').value || 9.81;
    const d = +document.getElementById('c7c').value || 0;
    const v = Math.sqrt(2 * g * h);
    const a = Math.PI * (d / 2) ** 2;
    const q = a * v;
    document.getElementById('r7').textContent =
      `v = ${v.toFixed(4)} m/s | A = ${(a * 10000).toFixed(4)} cm² | Q = ${(q * 1000).toFixed(4)} L/s`;
  },

  c8() {
    const p1 = +document.getElementById('c8a').value || 1;
    const v1 = +document.getElementById('c8b').value || 1;
    const t1 = +document.getElementById('c8c').value || 293;
    const p2 = +document.getElementById('c8d').value || 1;
    const t2 = +document.getElementById('c8e').value || 293;
    const v2 = p1 * v1 * t2 / (t1 * p2);
    document.getElementById('r8').textContent = `V₂ = ${v2.toFixed(5)} m³`;
  },

  tc() {
    const v  = +document.getElementById('tc_v').value;
    const f  = document.getElementById('tc_from').value;
    let c, k, fa;
    if (f === '°C')      { c = v; k = v + 273.15; fa = v * 9 / 5 + 32; }
    else if (f === 'K')  { k = v; c = v - 273.15; fa = c * 9 / 5 + 32; }
    else                  { fa = v; c = (v - 32) * 5 / 9; k = c + 273.15; }
    document.getElementById('tc_res').textContent =
      `${c.toFixed(3)} °C = ${k.toFixed(3)} K = ${fa.toFixed(3)} °F`;
  },
};

/* Inicializa calculadoras */
Object.values(C).forEach(fn => fn());


/* ── § 7. SIMULADORES ────────────────────────────────────────── */
/* (lógica de simulação não alterada — sem injeção de dados do user) */

function inp(id) {
  const v = parseFloat(document.getElementById(id)?.value);
  return isNaN(v) ? NaN : v;
}

function setRho(v) {
  const el = document.getElementById('b-rho');
  if (el) el.value = v;
  bernCalcRT();
}

/* Helpers de passo a passo */
function numP(n, color) {
  return `<div class="sim-solve-num sim-solve-num-${color}">${n}</div>`;
}
function stepP(n, title, body) {
  return `<div class="sim-solve-step">${numP(n,'p')}<div style="flex:1"><div style="font-size:10px;font-weight:600;color:var(--p);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px">${title}</div>${body}</div></div>`;
}
function stepG(n, title, body) {
  return `<div class="sim-solve-step">${numP(n,'g')}<div style="flex:1"><div style="font-size:10px;font-weight:600;color:var(--g);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px">${title}</div>${body}</div></div>`;
}
function eq(txt, green) {
  return `<div class="sim-eq-box${green?' sim-eq-box-g':''}">${txt}</div>`;
}
function valGrid(items, cols) {
  return `<div class="sim-val-box" style="grid-template-columns:repeat(${cols},1fr)">${
    items.map(([lbl,val,c]) =>
      `<div class="sim-val-card"><div class="sim-val-lbl">${lbl}</div><div class="sim-val-num" style="color:var(--${c||'p'})">${val}</div></div>`
    ).join('')
  }</div>`;
}

/* ── Simulador 1: Continuidade — tempo real ── */
function contCalcRT() {
  const d1 = inp('c-d1'), v1 = inp('c-v1'), d2 = inp('c-d2');
  const err     = document.getElementById('c-err');
  const alertEl = document.getElementById('c-alert');
  if (err)     err.style.display     = 'none';
  if (alertEl) alertEl.style.display = 'none';

  if ([d1,v1,d2].some(isNaN) || d1 <= 0 || d2 <= 0 || v1 < 0) {
    document.getElementById('c-v2-prev').textContent = 'V₂ = ?';
    document.getElementById('c-qv-prev').textContent = 'Qv = ?';
    updateContSVG(null,null,null,null,null);
    return;
  }

  const a1 = Math.PI * (d1/2)**2, a2 = Math.PI * (d2/2)**2;
  const v2 = v1 * (a1/a2), qv = a1 * v1;

  document.getElementById('c-v2-prev').textContent = `V₂ = ${v2.toFixed(3)} m/s`;
  document.getElementById('c-qv-prev').textContent = `Qv = ${(qv*1000).toFixed(3)} L/s = ${(qv*3600).toFixed(2)} m³/h`;
  document.getElementById('c-d-hint').textContent  =
    d2 < d1 ? 'D₂ < D₁ → fluido acelera' : d2 > d1 ? 'D₂ > D₁ → fluido desacelera' : 'D₂ = D₁ → velocidade constante';

  if (alertEl) {
    if (v2 > 15) {
      alertEl.className = 'sim-alert-ctx sim-alert-warn';
      alertEl.textContent = '⚠ V₂ muito alta (>15 m/s) — pode causar erosão na tubulação e ruído excessivo.';
      alertEl.style.display = 'block';
    } else if (v2 < 0.3) {
      alertEl.className = 'sim-alert-ctx sim-alert-info';
      alertEl.textContent = 'ℹ V₂ muito baixa (<0,3 m/s) — medidores de turbina podem não operar corretamente.';
      alertEl.style.display = 'block';
    }
  }

  updateContSVG(d1,v1,d2,v2,qv);
  buildContSolve(d1,v1,d2,a1,a2,v2,qv);
}

function updateContSVG(d1,v1,d2,v2,qv) {
  const s = document.getElementById('svg-cont');
  if (!s || !d1) return;
  const vr   = v2 && v1 ? Math.min(v2/v1, 6) : 1;
  const l2   = Math.min(80*vr, 160);
  ['sv2a','sv2b','sv2c'].forEach(id => {
    document.getElementById(id)?.setAttribute('x2', String(id === 'sv2a' ? 250+l2 : 255+l2*0.85));
  });
  const fields = { 'lbl-v2':`V₂=${v2.toFixed(2)} m/s`,'lbl-qv':`Qv = ${(qv*1000).toFixed(2)} L/s`,
    'lbl-d1':`D₁=${d1} m`,'lbl-v1':`V₁=${v1} m/s`,'lbl-d2':`D₂=${d2} m` };
  for (const [id, txt] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
}

function buildContSolve(d1,v1,d2,a1,a2,v2,qv) {
  const body = document.getElementById('solve-c-body');
  if (!body) return;
  body.innerHTML =
    stepP('1','Dados conhecidos', valGrid([['D₁',d1+' m','p'],['V₁',v1+' m/s','p'],['D₂',d2+' m','g']],3)) +
    stepP('2','Áreas — A = π·(D/2)²', eq(`A₁ = ${a1.toFixed(5)} m²`) + eq(`A₂ = ${a2.toFixed(5)} m²`)) +
    stepP('3','Isole V₂ — Continuidade', eq('A₁·V₁ = A₂·V₂ → V₂ = V₁ × (D₁/D₂)²')) +
    stepP('4','Substituição', eq(`V₂ = ${v1} × ${((d1/d2)**2).toFixed(4)} = ${v2.toFixed(4)} m/s`)) +
    stepP('5','Resultado', `<div class="sim-res-final sim-res-final-p"><div><div class="sim-res-label">V₂</div><div class="sim-res-sub">Qv = ${(qv*1000).toFixed(3)} L/s</div></div><div style="text-align:right"><div class="sim-res-value sim-res-value-p">${v2.toFixed(3)} m/s</div></div></div>`);
}

function toggleSimSolve(id) {
  const el  = document.getElementById('solve-' + id);
  const btn = document.getElementById('btn-' + id + 'solve');
  if (!el) return;
  const open = el.style.display === 'none';
  el.style.display = open ? 'block' : 'none';
  if (btn) btn.textContent = (open ? '▼ ' : '▶ ') + 'Passo a passo';
}

function contReset() {
  ['c-d1','c-v1','c-d2'].forEach((id,i) => {
    const el = document.getElementById(id);
    if (el) el.value = ['0.1','2','0.05'][i];
  });
  ['c-err','c-alert'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('c-v2-prev').textContent = 'V₂ = ?';
  document.getElementById('c-qv-prev').textContent = 'Qv = ?';
  const sc = document.getElementById('solve-c');
  if (sc) sc.style.display = 'none';
  const btn = document.getElementById('btn-csolve');
  if (btn) btn.textContent = '▶ Passo a passo';
  contCalcRT();
}

/* ── Simulador 2: Bernoulli ── */
let bernTarget = 'p2';

function setBernTarget(target) {
  bernTarget = target;
  ['p2','v2','p1','v1'].forEach(t => {
    document.getElementById('bsf-' + t)?.classList.toggle('bsf-active', t === target);
  });
  const resultOf = { p2:['b-p2-input'], v2:['b-v2'], p1:['b-p1'], v1:['b-v1'] };
  ['b-v1','b-p1','b-v2','b-p2-input'].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    const isResult = (resultOf[target] ?? []).includes(id);
    el.disabled     = isResult;
    el.style.opacity = isResult ? '0.5' : '1';
    el.style.color   = isResult ? 'var(--y)' : '';
  });
  const rb = document.getElementById('b-result-box');
  rb?.classList.toggle('target-s1', target === 'p1' || target === 'v1');
  bernCalcRT();
}

function bernCalcRT() {
  const g = 9.81, rho = inp('b-rho');
  const z1 = inp('b-z1') || 0, z2 = inp('b-z2') || 0;
  const err = document.getElementById('b-err');
  const alertEl = document.getElementById('b-alert');
  if (err)     err.style.display     = 'none';
  if (alertEl) alertEl.style.display = 'none';

  function setRes(txt, sub) {
    const p = document.getElementById('b-p2-prev');
    const b = document.getElementById('b-bar-prev');
    if (p) p.textContent = txt;
    if (b) b.textContent = sub ?? '';
  }

  if (bernTarget === 'p2') {
    const v1 = inp('b-v1'), p1 = inp('b-p1'), v2 = inp('b-v2');
    if ([rho,v1,p1,v2].some(isNaN) || rho <= 0) { setRes('P₂ = ?',''); return; }
    const tCin = rho*(v1**2-v2**2)/2, tPot = rho*g*(z1-z2), p2 = p1+tCin+tPot;
    setRes('P₂ = '+p2.toFixed(0)+' Pa', (p2/1e5).toFixed(4)+' bar');
    const pi = document.getElementById('b-p2-input'); if (pi) pi.value = p2.toFixed(0);
    updateBernSVG(v1,v2,p1,p2,p1-p2);
    buildBernSolveP2(rho,v1,p1,z1,v2,z2,g,tCin,tPot,p2,p1-p2);
    setBernAlerts(p2,p1-p2,v1,v2,rho,alertEl);
  } else if (bernTarget === 'v2') {
    const v1 = inp('b-v1'), p1 = inp('b-p1'), p2 = inp('b-p2-input');
    if ([rho,v1,p1,p2].some(isNaN) || rho <= 0) { setRes('V₂ = ?',''); return; }
    const inner = v1**2 + 2*(p1-p2)/rho + 2*g*(z1-z2);
    if (inner < 0) { if(err){err.textContent='Impossível: V₂² negativo.';err.style.display='block';} return; }
    const v2 = Math.sqrt(inner);
    setRes('V₂ = '+v2.toFixed(4)+' m/s','velocidade na saída');
    const vi = document.getElementById('b-v2'); if (vi?.disabled) vi.value = v2.toFixed(4);
    updateBernSVG(v1,v2,p1,p2,p1-p2);
    buildBernSolveV2(rho,v1,p1,z1,p2,z2,g,v2);
    setBernAlerts(p2,p1-p2,v1,v2,rho,alertEl);
  } else if (bernTarget === 'p1') {
    const v1 = inp('b-v1'), v2 = inp('b-v2'), p2 = inp('b-p2-input');
    if ([rho,v1,v2,p2].some(isNaN) || rho <= 0) { setRes('P₁ = ?',''); return; }
    const tCin = rho*(v2**2-v1**2)/2, tPot = rho*g*(z2-z1), p1 = p2+tCin+tPot;
    setRes('P₁ = '+p1.toFixed(0)+' Pa', (p1/1e5).toFixed(4)+' bar');
    const pi = document.getElementById('b-p1'); if (pi?.disabled) pi.value = p1.toFixed(0);
    updateBernSVG(v1,v2,p1,p2,p1-p2);
    buildBernSolveP1(rho,v1,p1,z1,v2,p2,z2,g,tCin,tPot,p1-p2);
    setBernAlerts(p2,p1-p2,v1,v2,rho,alertEl);
  } else if (bernTarget === 'v1') {
    const p1 = inp('b-p1'), v2 = inp('b-v2'), p2 = inp('b-p2-input');
    if ([rho,p1,v2,p2].some(isNaN) || rho <= 0) { setRes('V₁ = ?',''); return; }
    const inner = v2**2 + 2*(p2-p1)/rho + 2*g*(z2-z1);
    if (inner < 0) { if(err){err.textContent='Impossível: V₁² negativo.';err.style.display='block';} return; }
    const v1 = Math.sqrt(inner);
    setRes('V₁ = '+v1.toFixed(4)+' m/s','velocidade na entrada');
    const vi = document.getElementById('b-v1'); if (vi?.disabled) vi.value = v1.toFixed(4);
    updateBernSVG(v1,v2,p1,p2,p1-p2);
    buildBernSolveV1(rho,v1,p1,z1,v2,p2,z2,g);
    setBernAlerts(p2,p1-p2,v1,v2,rho,alertEl);
  }
}

function _updP1hint(p1) {
  const h = document.getElementById('b-p1-hint');
  if (h && !isNaN(p1) && bernTarget !== 'p1')
    h.textContent = `${p1.toFixed(0)} Pa = ${(p1/1e5).toFixed(4)} bar`;
}

function setBernAlerts(p2,dp,v1,v2,rho,alertEl) {
  if (!alertEl) return;
  const al = [];
  if (!isNaN(p2) && p2 < 0)     al.push(['danger','⚠ Cavitação: pressão negativa! O fluido vaporiza.']);
  if (!isNaN(p2) && p2 < 2300 && p2 >= 0) al.push(['warn','⚠ Pressão muito baixa — risco de cavitação.']);
  if (!isNaN(dp) && dp < 0)     al.push(['info','ℹ ΔP negativo: pressão de saída maior que a de entrada.']);
  if (!isNaN(v2) && v2 > 15)    al.push(['warn','⚠ V₂ > 15 m/s — risco de erosão e ruído.']);
  if (al.length) {
    alertEl.className   = 'sim-alert-ctx sim-alert-' + al[0][0];
    alertEl.textContent = al.map(a => a[1]).join(' | ');
    alertEl.style.display = 'block';
  }
}

function updateBernSVG(v1,v2,p1,p2,dp) {
  const fields = {
    'bp1-val': isNaN(p1)?'?':(p1/1e5).toFixed(3)+' bar',
    'bp2-val': isNaN(p2)?'?':(p2/1e5).toFixed(3)+' bar',
    'bv1-lbl': 'V₁='+(isNaN(v1)?'?':Number(v1).toFixed(2))+' m/s',
    'bv2-lbl': 'V₂='+(isNaN(v2)?'?':Number(v2).toFixed(2))+' m/s',
    'bdp-lbl': isNaN(dp)?'ΔP = ?':'ΔP = '+(dp/1e5).toFixed(3)+' bar',
  };
  for (const [id, txt] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  const sv2 = document.getElementById('bv2-line');
  if (sv2 && !isNaN(v2) && !isNaN(v1) && v2 >= 0) {
    const r = Math.min(Math.max(v2 / Math.max(v1||1, 0.1), 0.3), 5);
    sv2.setAttribute('x2', String(225 + Math.min(r*90, 200)));
  }
  const bp2lbl = document.getElementById('bp2-lbl');
  if (bp2lbl) bp2lbl.setAttribute('fill', isNaN(p2)||p2<0 ? 'var(--r)' : 'var(--g)');
}

function _bsolveBody(h) {
  const b = document.getElementById('solve-b-body');
  if (b) b.innerHTML = h;
}

function buildBernSolveP2(rho,v1,p1,z1,v2,z2,g,tCin,tPot,p2,dp) {
  const hz = z1 === z2;
  _bsolveBody(
    stepG('1','Dados',valGrid([['ρ',rho+' kg/m³','t2'],['V₁',v1+' m/s','p'],['V₂',v2+' m/s','g'],['P₁',(p1/1e5).toFixed(3)+' bar','p']],4)) +
    stepG('2','Fórmula',eq('P₂ = P₁ + ρ·(V₁²−V₂²)/2 + ρ·g·(h₁−h₂)',true)) +
    stepG('3','Cinético',eq(`${rho}×(${v1}²−${v2}²)/2 = ${tCin.toFixed(2)} Pa`,true)) +
    stepG('4','Potencial',hz?eq('h₁=h₂ → 0',true):eq(`${rho}×${g}×(${z1-z2}) = ${tPot.toFixed(2)} Pa`,true)) +
    stepG('5','Resultado',`<div class="sim-res-final"><div><div class="sim-res-label">P₂</div><div class="sim-res-sub">${(p2/1e5).toFixed(4)} bar</div></div><div style="text-align:right"><div class="sim-res-value" style="color:${p2<0?'var(--r)':'var(--g)'}">${p2.toFixed(0)} Pa</div></div></div>`)
  );
}

function buildBernSolveV2(rho,v1,p1,z1,p2,z2,g,v2) {
  _bsolveBody(
    stepG('1','Dados',valGrid([['ρ',rho+' kg/m³','t2'],['V₁',v1+' m/s','p'],['P₁',(p1/1e5).toFixed(3)+' bar','p'],['P₂',(p2/1e5).toFixed(3)+' bar','g']],4)) +
    stepG('2','Fórmula',eq('V₂ = √[ V₁² + 2(P₁−P₂)/ρ + 2g·(h₁−h₂) ]',true)) +
    stepG('3','Resultado',`<div class="sim-res-final"><div class="sim-res-label">V₂</div><div style="text-align:right"><div class="sim-res-value">${v2.toFixed(4)} m/s</div></div></div>`)
  );
}

function buildBernSolveP1(rho,v1,p1,z1,v2,p2,z2,g,tCin,tPot,dp) {
  _bsolveBody(
    stepG('1','Dados',valGrid([['ρ',rho+' kg/m³','t2'],['V₁',v1+' m/s','p'],['V₂',v2+' m/s','g'],['P₂',(p2/1e5).toFixed(3)+' bar','g']],4)) +
    stepG('2','Fórmula',eq('P₁ = P₂ + ρ·(V₂²−V₁²)/2 + ρ·g·(h₂−h₁)',true)) +
    stepG('3','Substituição',eq(`P₁ = ${p2} + ${tCin.toFixed(2)} + ${tPot.toFixed(2)} = ${p1.toFixed(2)} Pa`,true)) +
    stepG('4','Resultado',`<div class="sim-res-final"><div class="sim-res-label">P₁</div><div style="text-align:right"><div class="sim-res-value sim-res-value-p">${p1.toFixed(0)} Pa</div><div class="sim-res-sub">${(p1/1e5).toFixed(4)} bar</div></div></div>`)
  );
}

function buildBernSolveV1(rho,v1,p1,z1,v2,p2,z2,g) {
  _bsolveBody(
    stepG('1','Dados',valGrid([['ρ',rho+' kg/m³','t2'],['V₂',v2+' m/s','g'],['P₁',(p1/1e5).toFixed(3)+' bar','p'],['P₂',(p2/1e5).toFixed(3)+' bar','g']],4)) +
    stepG('2','Fórmula',eq('V₁ = √[ V₂² + 2(P₂−P₁)/ρ + 2g·(h₂−h₁) ]',true)) +
    stepG('3','Resultado',`<div class="sim-res-final"><div class="sim-res-label">V₁</div><div style="text-align:right"><div class="sim-res-value sim-res-value-p">${v1.toFixed(4)} m/s</div></div></div>`)
  );
}

function importV2() {
  const d1 = inp('c-d1'), v1 = inp('c-v1'), d2 = inp('c-d2');
  if ([d1,v1,d2].some(isNaN) || d1 <= 0 || d2 <= 0) {
    alert('Preencha o Simulador 1 primeiro.'); return;
  }
  const a1 = Math.PI*(d1/2)**2, a2 = Math.PI*(d2/2)**2;
  const el = document.getElementById('b-v2');
  if (el) el.value = (v1*(a1/a2)).toFixed(4);
  bernCalcRT();
}

function bernReset() {
  const vals = { 'b-rho':'1000','b-v1':'2','b-p1':'220000','b-z1':'0','b-v2':'8','b-z2':'0' };
  for (const [id, val] of Object.entries(vals)) {
    const el = document.getElementById(id); if (el) el.value = val;
  }
  const p2i = document.getElementById('b-p2-input'); if (p2i) p2i.value = '190000';
  ['b-err','b-alert'].forEach(id => { const el=document.getElementById(id); if(el)el.style.display='none'; });
  const prev = document.getElementById('b-p2-prev'); if (prev) prev.textContent = 'P₂ = ?';
  const bar  = document.getElementById('b-bar-prev'); if (bar) bar.textContent = '';
  const sb   = document.getElementById('solve-b'); if (sb) sb.style.display = 'none';
  const btn  = document.getElementById('btn-bsolve'); if (btn) btn.textContent = '▶ Passo a passo';
  setBernTarget('p2');
}

function exLoad(d1,v1,p1,z1,d2,z2) {
  [['c-d1',d1],['c-v1',v1],['c-d2',d2]].forEach(([id,v]) => { const el=document.getElementById(id);if(el)el.value=v; });
  [['b-v1',v1],['b-p1',p1],['b-z1',z1],['b-z2',z2],['b-rho',1000]].forEach(([id,v]) => { const el=document.getElementById(id);if(el)el.value=v; });
  const a1=Math.PI*(d1/2)**2, a2=Math.PI*(d2/2)**2;
  const v2el=document.getElementById('b-v2'); if(v2el) v2el.value=(v1*(a1/a2)).toFixed(4);
  contCalcRT(); setBernTarget('p2');
}

function exLoadBern(rho,v1,z1,p1,v2,z2) {
  [['b-rho',rho],['b-v1',v1],['b-p1',p1],['b-z1',z1],['b-v2',v2],['b-z2',z2]]
    .forEach(([id,v]) => { const el=document.getElementById(id);if(el)el.value=v; });
  setBernTarget('p2');
}

/* ── Fórmulas visuais — toggle de resolução ── */
function toggleSolve(id) {
  const el = document.getElementById('fsolve-' + id);
  if (!el) return;
  const btn  = el.previousElementSibling?.querySelector('button');
  const open = !el.classList.contains('open');
  el.classList.toggle('open', open);
  if (btn) btn.textContent = (open ? '▼ ' : '▶ ') + 'Ver resolução';
}

/* ── Highlight diagrama ↔ legenda ── */
(function initFvInteract() {
  function onHover(varKey, on) {
    document.querySelectorAll(`[data-var="${varKey}"]`).forEach(el => {
      if (el.tagName === 'TR') {
        el.classList.toggle('leg-hl', on);
      } else {
        const cls = [...el.classList].find(c => c.startsWith('fv-'))?.replace('fv-','') ?? 'p';
        if (on)  el.classList.add('fv-hl-' + cls);
        else     el.classList.remove(...[...el.classList].filter(c => c.startsWith('fv-hl-')));
      }
    });
    document.querySelectorAll(`.fv-el[data-var="${varKey}"]`).forEach(el => {
      el.style.filter = on ? 'brightness(1.5) drop-shadow(0 0 4px currentColor)' : '';
    });
  }

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-var]'); if (t) onHover(t.dataset.var, true);
  });
  document.addEventListener('mouseout', e => {
    const t = e.target.closest('[data-var]'); if (t) onHover(t.dataset.var, false);
  });
  document.addEventListener('touchstart', e => {
    const t = e.target.closest('[data-var]'); if (t) onHover(t.dataset.var, true);
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const t = e.target.closest('[data-var]');
    if (t) setTimeout(() => onHover(t.dataset.var, false), 600);
  }, { passive: true });
})();

/* ── Nav arrows ── */
function updateNavArrows() {
  const nb = document.getElementById('navBar');
  if (!nb) return;
  const has = nb.scrollWidth > nb.clientWidth + 2;
  document.querySelectorAll('.nav-arrow').forEach(a => { a.style.display = has ? 'flex' : 'none'; });
}

/* ── Init ── */
window.addEventListener('DOMContentLoaded', () => {
  contCalcRT();
  setBernTarget('p2');
  updateNavArrows();
  window.addEventListener('resize', updateNavArrows);

  /* Contadores dinâmicos */
  const nc = document.getElementById('dash-cards');
  const nq = document.getElementById('dash-qs');
  if (typeof CARDS !== 'undefined') {
    if (nc) nc.textContent = CARDS.length;
    const fcmn = document.getElementById('dash-fc-mn');
    if (fcmn) fcmn.textContent = CARDS.length + ' cards';
  }
  if (typeof QS !== 'undefined') {
    if (nq) nq.textContent = QS.length;
    const qzmn = document.getElementById('dash-qz-mn');
    if (qzmn) qzmn.textContent = QS.length + ' questões';
  }

  /* ③ Escuta sync de tema — verifica e.origin */
  window.addEventListener('message', e => {
    if (e.origin !== window.location.origin) return;
    const { type, theme } = e.data ?? {};
    if (type !== 'senai-theme-sync') return;
    if (theme !== 'light' && theme !== 'dark') return;
    /* ② Aplica via dataset.theme — sem classList.add('light') */
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('mvf-theme', theme);
    updateThemeBtn();
  });
});
