# Portal SENAI — Hub de Estudos 🎓

> Hub unificado para os aplicativos de estudo do Técnico em Automação Industrial · SENAI

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-brightgreen)](https://willianlsz1.github.io/portal_senai/)

---

## O que é este projeto?

O **Portal SENAI** é uma página central que integra dois aplicativos de estudo em uma única interface. Em vez de abrir links separados, o portal carrega cada app dentro de um iframe com navegação por abas — mantendo a identidade visual de cada um.

### Aplicativos integrados

| App | Nome completo | Repositório |
|-----|---------------|-------------|
| **MVF** | Medição de Variáveis Físicas | [Senai.MVF](https://github.com/Willianlsz1/Senai.MVF) |
| **EASA** | Eletroeletrônica Aplicada a Sistemas Automatizados | [EASA](https://github.com/Willianlsz1/EASA) |

---

## Funcionalidades

- **Navegação por abas** entre Portal, MVF e EASA sem recarregar a página
- **Lazy loading** — cada app só é carregado quando a aba é clicada pela primeira vez
- **Spinner de carregamento** animado enquanto o iframe inicializa
- **Botão "Nova aba ↗"** para abrir o app atual em janela separada do navegador
- **Dark / Light mode** com preferência salva automaticamente no `localStorage`
- 100% HTML + CSS + JavaScript vanilla — zero dependências externas

---

## Links

| Recurso | URL |
|---------|-----|
| **Portal (hub)** | https://willianlsz1.github.io/portal_senai/ |
| App MVF | https://willianlsz1.github.io/Senai.MVF/ |
| App EASA | https://willianlsz1.github.io/EASA/ |

---

## Estrutura de Repositórios

O projeto usa **três repositórios independentes** publicados pelo GitHub Pages:

```
portal_senai/          ← este repositório
│   index.html         ← única página do portal (obrigatório: index.html)
│   README.md

Senai.MVF/             ← app MVF (repositório separado)
│   index.html
│   ...

EASA/                  ← app EASA (repositório separado)
│   index.html
│   data.js
│   style.css
│   app.js
```

> ⚠️ O GitHub Pages serve **somente** `index.html` como página inicial. O arquivo do portal deve sempre se chamar `index.html`.

---

## Como atualizar o portal

### Pela interface do GitHub (sem precisar de Git)

1. Acesse [github.com/Willianlsz1/portal_senai](https://github.com/Willianlsz1/portal_senai)
2. Clique em `index.html`
3. Clique no ícone de lápis ✏️ — **Edit this file**
4. Cole o novo conteúdo
5. Clique em **Commit changes**

O GitHub Pages atualiza em alguns segundos após o commit.

---

## Como funciona (técnico)

### Lazy loading das iframes

```javascript
const APPS = {
  mvf:  'https://willianlsz1.github.io/Senai.MVF/',
  easa: 'https://willianlsz1.github.io/EASA/'
};

const loaded = { mvf: false, easa: false };

function switchTo(app) {
  // Só carrega o iframe quando a aba é clicada pela primeira vez
  if (!loaded[app]) {
    document.getElementById('frame-' + app).src = APPS[app];
    loaded[app] = true;
  }
}
```

### Dark / Light mode persistente

```javascript
// Salva preferência no navegador
localStorage.setItem('theme', 'dark');

// Restaura na próxima visita
const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);
```

### Layout das abas

```
┌──────────────────────────────────────────────┐
│  ⬡ SENAI  │ Portal │  MVF  │  EASA  │ 🌙 ↗ │
├──────────────────────────────────────────────┤
│                                              │
│              <iframe src="...">              │
│           (carregado ao clicar na aba)       │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Tecnologias

- **HTML5 / CSS3 / JavaScript ES6+** — sem frameworks ou bibliotecas
- **GitHub Pages** — hospedagem gratuita de sites estáticos
- **Google Fonts** — Exo 2, JetBrains Mono, Share Tech Mono

---

## Histórico

| Versão | Descrição |
|--------|-----------|
| v1.0 | Portal unificado com MVF e EASA, dark/light mode, lazy loading |

---

## Autor

**Willian** — Técnico em Automação Industrial · SENAI
