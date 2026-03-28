/* ═══════════════════════════════════════════════════════════
   SENAI · EASA — data.js  (v2.1)
   Dados centralizados da aplicação.
   Toda adição de conteúdo (cards, questões) acontece aqui.
═══════════════════════════════════════════════════════════ */

/* ── TÍTULOS DAS PÁGINAS ─────────────────────────────────── */
const PAGE_TITLES = {
  'dashboard':    'Dashboard · EASA',
  'fund-eletrica':'Módulo 01 · Eletricidade Básica',
  'cc':           'Módulo 02 · Circuitos CC',
  'ca':           'Módulo 03 · Circuitos CA',
  'semicond':     'Módulo 04 · Semicondutores',
  'transistor':   'Módulo 05 · Transistores',
  'opto':         'Módulo 06 · Optoeletrônica',
  'retificador':  'Módulo 07 · Retificadores',
  'numeracao':    'Módulo 08 · Sistemas Numéricos',
  'logica':       'Módulo 09 · Lógica Digital',
  'kirchhoff':    'Kirchhoff & Thévenin · Norton',
  'tiristor':     'Tiristores · SCR · DIAC · TRIAC',
  'amp':          'Amplificadores Operacionais · Op-Amp',
  'filtros':      'Filtros RC Passivos',
  'rcrl':         'Transientes RC/RL · Constante de Tempo τ',
  'conv':         'Conversores A/D e D/A · ADC · DAC',
  'formulas':     '★ Fórmulas Visuais',
  'calc':         '🧮 Calculadora',
  'flashcards':   '🃏 Flashcards',
  'quiz':         '📝 Quiz',
  'updates':      '📋 Atualizações',
};

/* ── FLASHCARDS ──────────────────────────────────────────── */
const FLASHCARDS = [
  // ── Fundamentos ─────────────────────────────────────────
  {
    q: 'Qual é a unidade de medida da resistência elétrica?',
    a: 'Ohm (Ω)',
    s: 'Em homenagem a Georg Simon Ohm (1789–1854).',
  },
  {
    q: 'O que é a 1ª Lei de Kirchhoff (LCK)?',
    a: 'Soma das correntes = 0',
    s: 'Correntes que entram num nó = correntes que saem.',
  },
  {
    q: 'O que é a 2ª Lei de Kirchhoff (LTK)?',
    a: 'Soma das tensões em uma malha = 0',
    s: 'Base para análise de malhas em circuitos CC complexos.',
  },
  // ── Semicondutores ──────────────────────────────────────
  {
    q: 'Qual é a tensão de barreira do diodo de silício?',
    a: '≈ 0,7 V',
    s: 'Germânio ≈ 0,3V. Abaixo desse valor o diodo não conduz.',
  },
  {
    q: 'O que é dopagem de semicondutor?',
    a: 'Adição de impurezas para modificar condutividade',
    s: 'Tipo P: impurezas trivalentes (boro). Tipo N: pentavalentes (fósforo).',
  },
  // ── Transistores ────────────────────────────────────────
  {
    q: 'O que significa β (beta) do transistor BJT?',
    a: 'Ganho de corrente: β = IC / IB',
    s: 'Típico: 50 a 500. Relaciona corrente da carga com sinal de controle.',
  },
  {
    q: 'Quais são as três regiões de operação do BJT?',
    a: 'Corte · Ativa · Saturação',
    s: 'Corte = chave aberta. Saturação = chave fechada. Ativa = amplificação.',
  },
  {
    q: 'Qual a diferença entre saída NPN e PNP de CLP?',
    a: 'NPN: drena corrente (sink). PNP: fornece corrente (source).',
    s: 'NPN conecta ao GND quando ativa. PNP conecta ao VCC quando ativa.',
  },
  // ── Optoeletrônica ──────────────────────────────────────
  {
    q: 'Qual componente realiza isolamento galvânico?',
    a: 'Acoplador óptico (optocoupler)',
    s: 'Isola eletricamente circuito de controle do circuito de campo.',
  },
  {
    q: 'Como calcular o resistor limitador do LED?',
    a: 'R = (VCC − VLED) / ILED',
    s: 'Exemplo: (5V − 2V) / 15mA = 200Ω. Sempre calcule para não queimar o LED!',
  },
  // ── Circuitos CA ────────────────────────────────────────
  {
    q: 'O que é Fator de Potência (FP)?',
    a: 'FP = cos(φ) = P / S',
    s: 'FP = 1 é ideal. FP baixo indica reatância — penalidade na conta industrial.',
  },
  {
    q: 'Qual a fórmula da reatância indutiva?',
    a: 'XL = 2πfL',
    s: 'Aumenta proporcionalmente com a frequência. Indutor de 100mH a 60Hz: XL ≈ 37,7Ω.',
  },
  {
    q: 'Qual a fórmula da reatância capacitiva?',
    a: 'XC = 1 / (2πfC)',
    s: 'Diminui com frequência (oposto ao indutor). Em CC (f=0): XC → infinito.',
  },
  {
    q: 'O que é impedância (Z)?',
    a: 'Z = √(R² + X²) — oposição total em CA',
    s: 'Inclui resistência (R) e reatância (X). Unidade: Ohm. Z = V/I em CA.',
  },
  // ── Retificadores ───────────────────────────────────────
  {
    q: 'O que é Ripple em uma fonte retificada?',
    a: 'Variação residual de tensão CA após retificação',
    s: 'Fator ripple = Vripple(ef) / Vdc. Menor com filtros maiores.',
  },
  // ── Digital ─────────────────────────────────────────────
  {
    q: 'Converta 1010₂ para decimal.',
    a: '10',
    s: '1×8 + 0×4 + 1×2 + 0×1 = 8 + 0 + 2 + 0 = 10.',
  },
  {
    q: 'Qual é o resultado da porta NAND com A=1 e B=1?',
    a: '0',
    s: 'NAND = NOT(A AND B). AND(1,1) = 1 → NOT(1) = 0.',
  },

  // ── Kirchhoff & Thévenin ────────────────────────────────
  {
    q: 'O que diz a 1ª Lei de Kirchhoff (LCK)?',
    a: 'Soma das correntes em um nó = 0',
    s: 'Correntes que entram = correntes que saem. Conservação de carga elétrica no nó.',
  },
  {
    q: 'O que diz a 2ª Lei de Kirchhoff (LTK)?',
    a: 'Soma das tensões em uma malha fechada = 0',
    s: 'Percorra a malha em qualquer sentido: ΣV = 0. Conservação de energia.',
  },
  {
    q: 'Como calcular Vth no Teorema de Thévenin?',
    a: 'Tensão em circuito aberto nos terminais A–B (sem carga)',
    s: 'Retire a carga, calcule a tensão entre os terminais A e B. Essa é a Vth.',
  },
  {
    q: 'Como calcular Rth no Teorema de Thévenin?',
    a: 'Zerar fontes e calcular resistência vista dos terminais A–B',
    s: 'Fontes de tensão → curto. Fontes de corrente → circuito aberto. Calcule R equivalente.',
  },
  {
    q: 'Qual a relação entre Norton e Thévenin?',
    a: 'In = Vth / Rth  e  Rn = Rth',
    s: 'Os dois representam o mesmo circuito. Thévenin = série. Norton = paralelo. Rn = Rth sempre.',
  },

  // ── Tiristores ──────────────────────────────────────────
  {
    q: 'O que é um SCR e como ele é disparado?',
    a: 'Diodo controlado — dispara com pulso positivo no gate (G) e VAK > 0',
    s: 'SCR = Silicon Controlled Rectifier. Unidirecional. Continua ligado mesmo sem gate. Desliga só quando corrente < IH.',
  },
  {
    q: 'Qual a diferença entre SCR e TRIAC?',
    a: 'SCR = unidirecional (CC). TRIAC = bidirecional (CA).',
    s: 'TRIAC equivale a dois SCRs em antiparalelo. Controla corrente nos dois semiciclos da CA.',
  },
  {
    q: 'Para que serve o DIAC?',
    a: 'Gerar o pulso de disparo do gate do TRIAC',
    s: 'DIAC conduz nos dois sentidos quando a tensão supera VBO (≈30V). Sem gate. Muito usado em dimmers com TRIAC.',
  },
  {
    q: 'O que é a corrente de holding (IH) de um tiristor?',
    a: 'Corrente mínima para manter o tiristor em condução',
    s: 'Se a corrente cair abaixo de IH, o tiristor desliga automaticamente — mesmo com o gate ainda ativado.',
  },

  // ── Amplificadores Op-Amp ───────────────────────────────
  {
    q: 'Qual o ganho do amplificador inversor?',
    a: 'Av = −Rf / Ri (negativo = sinal invertido)',
    s: 'Exemplo: Rf=10kΩ, Ri=1kΩ → Av = −10. A saída tem amplitude 10x maior e fase invertida.',
  },
  {
    q: 'Qual o ganho do amplificador não-inversor?',
    a: 'Av = 1 + Rf/R1 (positivo = sinal em fase)',
    s: 'Exemplo: Rf=9kΩ, R1=1kΩ → Av = 10. Sinal amplificado e em fase com a entrada.',
  },
  {
    q: 'O que é a regra de ouro do op-amp ideal?',
    a: 'Com realimentação negativa: V+ = V− (curto virtual) e corrente de entrada = 0',
    s: 'Rin = ∞ → sem corrente nas entradas. O op-amp ajusta Vout para igualar V+ e V−.',
  },
  {
    q: 'Como funciona o op-amp como comparador?',
    a: 'Sem realimentação: se V+ > V− → Vout = +Vsat; se V+ < V− → Vout = −Vsat',
    s: 'Opera em malha aberta com ganho enorme. A saída é binária (alto ou baixo). Detecta limiares.',
  },
  {
    q: 'O que é um buffer (seguidor de tensão) com op-amp?',
    a: 'Av = 1, Vout = Vin — isola impedâncias sem amplificar',
    s: 'Saída conectada diretamente à entrada inversora (−). Rin = ∞, Rout ≈ 0. Protege a fonte do sinal.',
  },

  // ── Filtros RC ──────────────────────────────────────────
  {
    q: 'Fórmula da frequência de corte de um filtro RC?',
    a: 'fc = 1 / (2π × R × C)',
    s: 'Em fc, a tensão cai para 70,7% da entrada (−3 dB). Exemplo: R=10kΩ, C=100nF → fc ≈ 159 Hz.',
  },
  {
    q: 'Qual a diferença entre filtro passa-baixa e passa-alta?',
    a: 'LPF: R série + C para GND. HPF: C série + R para GND.',
    s: 'LPF deixa baixas frequências passar (Vout = Vc). HPF deixa altas frequências passar (Vout = VR).',
  },
  {
    q: 'O que acontece com o sinal em fc (−3 dB)?',
    a: 'A tensão de saída cai para 70,7% de Vin (potência = metade)',
    s: '−3 dB = fator 0,707 = 1/√2. É o ponto de referência para definir a banda do filtro.',
  },

  // ── Transientes RC/RL (v1.2) ────────────────────────────
  {
    q: 'O que é a constante de tempo τ de um circuito RC?',
    a: 'τ = R × C — tempo para carregar a 63,2% do valor final',
    s: 'Com R em Ω e C em F, τ é em segundos. Em 5τ o capacitor está 99,3% carregado.',
  },
  {
    q: 'Qual a constante de tempo τ de um circuito RL?',
    a: 'τ = L / R',
    s: 'Com L em henries e R em ohms. Após 5τ a corrente no indutor atingiu regime permanente.',
  },
  {
    q: 'Em t = 2τ, qual a porcentagem de carga do capacitor?',
    a: '86,5%',
    s: 'Tabela: 1τ→63,2%, 2τ→86,5%, 3τ→95%, 4τ→98,2%, 5τ→99,3%.',
  },
  {
    q: 'O que é o fenômeno de "inductive kickback"?',
    a: 'Tensão elevada ao desligar um indutor abruptamente',
    s: 'O campo magnético colapsando gera tensão alta. Solução: diodo de roda-livre em paralelo com a carga indutiva.',
  },
  {
    q: 'Equação da tensão no capacitor durante a carga RC:',
    a: 'v_C(t) = Vs × (1 − e^(−t/τ))',
    s: 'Exponencial crescente. Começa em 0V, tende a Vs. A corrente começa alta (Vs/R) e vai a zero.',
  },

  // ── Conversores A/D e D/A (v1.3) ────────────────────────
  {
    q: 'O que é a resolução de um ADC de N bits?',
    a: 'LSB = Vref / 2ᴺ — menor tensão detectável',
    s: 'Exemplo: 10 bits, Vref=5V → LSB = 5/1024 ≈ 4,88 mV. Mais bits = maior precisão.',
  },
  {
    q: 'Qual o teorema fundamental para taxa de amostragem?',
    a: 'Teorema de Nyquist: fs ≥ 2 × fmax',
    s: 'A frequência de amostragem deve ser pelo menos o dobro da frequência máxima do sinal para evitar aliasing.',
  },
  {
    q: 'Qual tipo de ADC é usado em microcontroladores como Arduino?',
    a: 'SAR — Aproximação Sucessiva',
    s: 'Boa relação velocidade/resolução (8–16 bits). Flash é mais rápido, ΔΣ tem maior resolução.',
  },
  {
    q: 'Fórmula para converter tensão analógica em valor digital (ADC):',
    a: 'D = Vin × 2ᴺ / Vref',
    s: 'Exemplo: Arduino 10 bits, Vref=5V, Vin=2,5V → D = 2,5×1024/5 = 512.',
  },
  {
    q: 'O que é o erro de quantização em um ADC?',
    a: 'Incerteza de ± ½ LSB inerente à conversão',
    s: 'Não pode ser eliminado — é fundamental. Um ADC de maior resolução tem erro de quantização menor.',
  },
];

/* ── QUIZ ────────────────────────────────────────────────── */
const QUIZ_DATA = [
  {
    q: 'Em um circuito com V = 12V e R = 240Ω, qual é a corrente I?',
    opts: ['0,05 A', '0,5 A', '50 mA', 'Ambas a 1ª e 3ª'],
    ans: 3,
    exp: 'I = V/R = 12/240 = 0,05A = 50mA. As opções 1 e 3 são equivalentes!',
  },
  {
    q: 'Qual componente é usado para ISOLAMENTO GALVÂNICO entre CLP e campo?',
    opts: ['Transistor BJT', 'Resistor de pull-up', 'Acoplador óptico', 'Capacitor eletrolítico'],
    ans: 2,
    exp: 'O acoplador óptico (optocoupler) usa LED + fototransistor fisicamente isolados.',
  },
  {
    q: 'O transistor NPN no CLP opera como chave. Quando a base recebe sinal lógico 1:',
    opts: ['Coletor desconecta da carga', 'Transistor satura — chave fechada', 'Base bloqueia o coletor', 'Emissor eleva tensão'],
    ans: 1,
    exp: 'Com IB suficiente o BJT satura: VCE ≈ 0,2V — equivale a chave fechada.',
  },
  {
    q: 'A porta lógica NAND com entradas A=0 e B=1 resulta em:',
    opts: ['0', '1', 'Indeterminado', 'Igual ao AND'],
    ans: 1,
    exp: 'NAND = NOT(A AND B). AND(0,1) = 0 → NOT(0) = 1.',
  },
  {
    q: 'Numa fonte em ponte (4 diodos), qual é o fator ripple sem filtro?',
    opts: ['1,21', '0,48', '0,25', '2,00'],
    ans: 1,
    exp: 'Ponte retificadora com onda completa: ripple = 0,48. Meia onda = 1,21.',
  },
  {
    q: 'Dois resistores de 100Ω em paralelo resultam em:',
    opts: ['200 Ω', '50 Ω', '100 Ω', '25 Ω'],
    ans: 1,
    exp: 'Req = (R1×R2)/(R1+R2) = (100×100)/200 = 50Ω. Paralelo sempre < o menor.',
  },
  {
    q: 'Qual o valor decimal de 1111 0000 em binário?',
    opts: ['240', '248', '224', '252'],
    ans: 0,
    exp: '128+64+32+16+0+0+0+0 = 240. Nibble alto = 0xF = 15 × 16 = 240.',
  },
  {
    q: 'XL de um indutor de 50mH a 50Hz é:',
    opts: ['15,7 Ω', '3,14 Ω', '31,4 Ω', '157 Ω'],
    ans: 0,
    exp: 'XL = 2π×f×L = 2π×50×0,05 = 15,71Ω.',
  },
  {
    q: 'Qual resistor usar com LED (VCC=5V, VLED=2V, ILED=20mA)?',
    opts: ['100Ω', '150Ω', '200Ω', '50Ω'],
    ans: 1,
    exp: 'R = (5−2) / 0,02 = 150Ω. Use sempre o valor comercial mais próximo acima.',
  },
  {
    q: 'O Fator de Potência de uma carga puramente resistiva é:',
    opts: ['0', '0,5', '0,707', '1'],
    ans: 3,
    exp: 'FP = cos(φ). Carga resistiva: defasagem φ = 0° → cos(0°) = 1. FP ideal!',
  },

  // ── Kirchhoff & Thévenin ────────────────────────────────
  {
    q: 'Num nó, entram I₁=4A e I₂=3A. Qual a corrente que sai?',
    opts: ['4A', '3A', '7A', '1A'],
    ans: 2,
    exp: 'LCK: ΣI_entrada = ΣI_saída → 4+3 = 7A. Lei da conservação de carga.',
  },
  {
    q: 'Numa malha com Vs=12V, VR1=5V, VR2=4V. Qual VR3?',
    opts: ['12V', '9V', '3V', '21V'],
    ans: 2,
    exp: 'LTK: Vs − VR1 − VR2 − VR3 = 0 → 12−5−4−VR3=0 → VR3=3V.',
  },
  {
    q: 'Para calcular Rth (Thévenin), o que fazemos com fontes de tensão independentes?',
    opts: ['Abrimos o circuito', 'Substituímos por curto-circuito', 'Dobramos seu valor', 'Mantemos como estão'],
    ans: 1,
    exp: 'Fontes de tensão → curto-circuito (0V). Fontes de corrente → circuito aberto (0A).',
  },
  {
    q: 'Se Vth = 10V e Rth = 5Ω, qual a corrente de Norton (In)?',
    opts: ['50A', '2A', '0,5A', '15A'],
    ans: 1,
    exp: 'In = Vth / Rth = 10 / 5 = 2A. Rn = Rth = 5Ω. Os dois circuitos são equivalentes.',
  },

  // ── Tiristores ──────────────────────────────────────────
  {
    q: 'Qual tiristor é bidirecional e controla corrente CA?',
    opts: ['SCR', 'DIAC', 'TRIAC', 'Diodo Zener'],
    ans: 2,
    exp: 'TRIAC = 2 SCRs em antiparalelo. Controla CA nos dois semiciclos. Usado em dimmers e motores CA.',
  },
  {
    q: 'O que mantém o SCR em condução após o disparo do gate?',
    opts: ['Tensão contínua no gate', 'Corrente acima de IH (holding)', 'Temperatura elevada', 'Tensão reversa'],
    ans: 1,
    exp: 'Após o disparo, o gate pode ser retirado. O SCR continua ligado enquanto corrente > IH (corrente de holding).',
  },

  // ── Amplificadores ──────────────────────────────────────
  {
    q: 'Amplificador inversor com Rf=47kΩ e Ri=4,7kΩ. Qual o ganho?',
    opts: ['10', '−10', '47', '0,1'],
    ans: 1,
    exp: 'Av = −Rf/Ri = −47k/4,7k = −10. Negativo indica inversão de fase.',
  },
  {
    q: 'Amplificador não-inversor com Rf=8kΩ e R1=2kΩ. Qual o ganho?',
    opts: ['4', '5', '−4', '0,25'],
    ans: 1,
    exp: 'Av = 1 + Rf/R1 = 1 + 8k/2k = 1+4 = 5. Sinal em fase com a entrada.',
  },
  {
    q: 'Qual configuração de op-amp opera em malha aberta e gera saída binária?',
    opts: ['Buffer', 'Inversor', 'Comparador', 'Integrador'],
    ans: 2,
    exp: 'Comparador opera sem realimentação. A saída vai para +Vsat ou −Vsat conforme V+ > V− ou V+ < V−.',
  },

  // ── Filtros ─────────────────────────────────────────────
  {
    q: 'R=1kΩ, C=1µF. Qual a frequência de corte fc?',
    opts: ['159 Hz', '1000 Hz', '63 Hz', '318 Hz'],
    ans: 0,
    exp: 'fc = 1/(2π×1000×0,000001) = 1/(2π×0,001) ≈ 159 Hz. Fórmula: fc = 1/(2πRC).',
  },
  {
    q: 'Em qual configuração RC o capacitor fica em série com a carga (passa-alta)?',
    opts: ['R em série, C para GND', 'C em série, R para GND', 'R e C em paralelo', 'Sem diferença'],
    ans: 1,
    exp: 'HPF: C em série com a entrada, R em paralelo com a saída (para GND). Vout = Tensão em R.',
  },

  // ── Transientes RC/RL (v1.2) ────────────────────────────
  {
    q: 'Circuito RC com R=2kΩ e C=50μF. Qual é τ?',
    opts: ['0,1 s', '1 s', '0,01 s', '10 s'],
    ans: 0,
    exp: 'τ = R × C = 2000 × 50×10⁻⁶ = 0,1 s. Em 5τ (0,5s) o circuito atingiu regime permanente.',
  },
  {
    q: 'Qual a equação da corrente no indutor durante energização de um circuito RL?',
    opts: [
      'i(t) = (Vs/R) × e^(−t/τ)',
      'i(t) = (Vs/R) × (1 − e^(−t/τ))',
      'i(t) = Vs × e^(−t/τ)',
      'i(t) = (Vs/L) × t',
    ],
    ans: 1,
    exp: 'A corrente começa em 0 e cresce exponencialmente até Vs/R. τ = L/R. Em 5τ: praticamente Vs/R.',
  },
  {
    q: 'Em t = τ, um capacitor em carga RC atingiu qual porcentagem da tensão final?',
    opts: ['50%', '63,2%', '86,5%', '99,3%'],
    ans: 1,
    exp: '63,2% é o valor da constante natural (1 − e⁻¹ ≈ 0,632). Esse é o ponto definidor de τ.',
  },

  // ── Conversores A/D e D/A (v1.3) ────────────────────────
  {
    q: 'ADC de 12 bits com Vref=10V. Qual a resolução (LSB)?',
    opts: ['≈ 2,44 mV', '≈ 4,88 mV', '≈ 10 mV', '≈ 1,22 mV'],
    ans: 0,
    exp: 'LSB = 10V / 2¹² = 10 / 4096 ≈ 2,44 mV. Mais bits = menor LSB = mais preciso.',
  },
  {
    q: 'Qual a frequência mínima de amostragem para um sinal de áudio de 20kHz?',
    opts: ['10 kHz', '20 kHz', '40 kHz', '80 kHz'],
    ans: 2,
    exp: 'Teorema de Nyquist: fs ≥ 2 × fmax = 2 × 20kHz = 40kHz. CDs usam 44,1 kHz.',
  },
  {
    q: 'Para gerar 1,25V com um DAC de 8 bits e Vref=5V, qual valor gravar no registrador?',
    opts: ['64', '128', '50', '32'],
    ans: 0,
    exp: 'D = Vout × 2ᴺ / Vref = 1,25 × 256 / 5 = 64. Vout = 64 × 5 / 256 = 1,25V. ✓',
  },
];

/* ── CHANGELOG / ATUALIZAÇÕES ───────────────────────────── */
const UPDATES = [
  /* Versão mais recente no topo */
  {
    version: 'v2.1',
    title: 'Layout Global Aprimorado + RC/RL + Conversores A/D D/A',
    date: 'Mar 2026',
    type: 'live',
    items: [
      'Redesign completo do layout: tipografia maior (16px base), cards mais espaçosos, melhor uso da tela',
      'Módulo Transientes RC/RL (v1.2): equações de carga/descarga, tabela de progresso temporal, exemplo prático',
      'Módulo Conversores A/D e D/A (v1.3): resolução, LSB, tipos de ADC (SAR, Flash, ΔΣ), Teorema de Nyquist',
      'CSS global reescrito: .content-wrap sem limite rígido, fonte base aumentada, espaçamentos otimizados',
      '12 novos flashcards cobrindo RC/RL e Conversores',
      '6 novas questões de quiz com cálculos de τ, DAC e ADC',
    ],
  },
  {
    version: 'v2.0',
    title: 'Kirchhoff, Thévenin, Tiristores, Op-Amp & Filtros RC',
    date: 'Mar 2025',
    type: 'live',
    items: [
      'Módulo Kirchhoff & Thévenin/Norton: LCK, LTK, cálculo de Vth/Rth, equivalente de Norton',
      'Módulo Tiristores: SCR, DIAC e TRIAC com diagramas e aplicações industriais',
      'Módulo Amplificadores Operacionais: inversor, não-inversor, comparador, buffer, CI 741',
      'Módulo Filtros RC: passa-baixa, passa-alta, passa-banda com gráfico de resposta em frequência',
      '19 novos flashcards cobrindo todos os módulos adicionados',
      '11 novas questões de quiz com explicações detalhadas',
    ],
  },
  {
    version: 'v1.0',
    title: 'Lançamento — Base Completa',
    date: 'Mar 2025',
    type: 'live',
    items: [
      '9 módulos de teoria: Eletricidade Básica, CC, CA, Semicondutores, Transistores, Optoeletrônica, Retificadores, Sistemas Numéricos, Lógica Digital',
      'Fórmulas visuais interativas: Ohm, Potência, Série, Paralelo, Impedância, β BJT',
      '6 calculadoras: Lei de Ohm, Potência, Série, Paralelo, Resistor LED, Divisor de tensão',
      '17 flashcards com flip 3D em 6 categorias',
      '10 questões de quiz com feedback e explicação',
      'Dark mode e Light mode com estética de circuito impresso (PCB)',
    ],
  },
];
