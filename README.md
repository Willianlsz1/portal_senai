# SENAI · Monorepo de Estudos 🎓

> Repositório único com os três projetos do Técnico em Automação Industrial · SENAI

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-brightgreen)](https://willianlsz1.github.io/portal_senai/)

---

## Estrutura do Monorepo

```
portal_senai/               ← este repositório
├── index.html              ← Portal hub (navegação entre apps)
├── README.md
├── LICENSE
│
├── src/
│   ├── components/         ← utilitários de UI compartilhados
│   ├── modules/            ← lógica JS por módulo (portal, mvf, easa)
│   ├── pages/              ← reservado para expansão de páginas
│   ├── styles/             ← tokens, design system e estilos por módulo
│   └── utils/              ← reservado para helpers utilitários
│
├── senai-mvf/
│   └── index.html          ← view do módulo MVF
│
└── easa/
    └── index.html          ← view do módulo EASA
```

---

## Projetos

### Portal (raiz)
Hub central com navegação por abas entre os dois apps. Carrega cada app em iframe com lazy loading.

- **URL:** `https://willianlsz1.github.io/portal_senai/`

### SENAI · MVF — Medição de Variáveis Físicas
App de estudos para Pressão, Nível, Vazão e Temperatura com fórmulas interativas, simuladores Bernoulli/Continuidade, flashcards (78 cards) e quiz (53 questões).

- **URL:** `https://willianlsz1.github.io/portal_senai/senai-mvf/`
- **Versão:** v5.5

### SENAI · EASA — Eletrônica Aplicada a Sistemas de Automação
App de estudos com 9+ módulos de eletrônica, calculadoras (Ohm, Potência, Kirchhoff, op-amp, filtros RC), flashcards e quiz.

- **URL:** `https://willianlsz1.github.io/portal_senai/easa/`
- **Versão:** v2.1

---

## Tecnologias

- **HTML5 / CSS3 / JavaScript ES6+** — sem frameworks ou bibliotecas externas
- **GitHub Pages** — hospedagem estática gratuita
- **Google Fonts** — IBM Plex, JetBrains Mono, Exo 2, Share Tech Mono

---

## Como rodar localmente

Basta abrir `index.html` do portal diretamente no navegador. Cada app também pode ser aberto individualmente pela sua pasta.

```
portal_senai/index.html                  ← portal completo
portal_senai/senai-mvf/index.html        ← app MVF standalone
portal_senai/easa/index.html             ← app EASA standalone
```

---

## Autor

**Willian** — Técnico em Automação Industrial · SENAI
