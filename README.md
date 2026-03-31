# 🎓 Portal de Estudos SENAI

Portal web de estudos para apoio ao curso técnico, organizado em módulos de aprendizado com navegação centralizada, interface responsiva e conteúdos interativos.

O projeto funciona como um **hub educacional** que integra dois ambientes principais:

- **MVF (Medição de Variáveis Físicas)**
- **EASA (Eletrônica Aplicada a Sistemas de Automação)**

---

## 🔎 Demonstração

- **GitHub Pages (produção):** https://willianlsz1.github.io/portal_senai/

### Uso rápido

1. Acesse o portal principal.
2. Escolha um módulo pela navegação superior ou pelos cards da home.
3. Estude os conteúdos por trilha (teoria, prática, fórmulas, quiz e flashcards).
4. Alterne entre os ambientes MVF e EASA sem perder a experiência de navegação.

---

## ✨ Funcionalidades

- ✅ Navegação por módulos de estudo (portal + apps específicos).
- ✅ Sidebar funcional nos ambientes de conteúdo.
- ✅ Organização por tópicos técnicos (ex.: **Circuitos CC**, instrumentação, variáveis de processo).
- ✅ Interface responsiva para desktop e mobile.
- ✅ Tema claro/escuro com persistência local.
- ✅ Acesso direto aos apps MVF e EASA pelo portal.

---

## 🗂️ Estrutura do Projeto

A refatoração consolidou uma estrutura mais clara, separando **componentes compartilhados**, **lógica por módulo** e **estilos reutilizáveis**.

```bash
portal_senai/
├── index.html                  # Portal principal (hub)
├── README.md
├── LICENSE
├── easa/
│   └── index.html              # App EASA
├── senai-mvf/
│   └── index.html              # App MVF
└── src/
    ├── components/             # Helpers/componentes compartilhados (ex.: navegação)
    ├── modules/                # Scripts por domínio (portal, mvf, easa)
    └── styles/
        ├── shared/             # Tokens, design system e estilos globais
        └── modules/            # Estilos específicos de cada módulo
```

> Estrutura preparada para expansão com camadas como `pages/` e `utils/`, mantendo o padrão modular da refatoração.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **GitHub Pages** (deploy estático)

---

## 🚀 Melhorias Recentes (Refatoração)

Principais evoluções aplicadas recentemente no projeto:

- **Correção da navegação via cards** no portal e nos módulos.
- **Padronização de rotas e troca de telas** (hash/navigation state) entre áreas.
- **Limpeza e organização de código**, com separação de responsabilidades.
- **Reestruturação de pastas** para facilitar manutenção e escalabilidade.
- **Padronização visual e de componentes** (tokens, estilos compartilhados e módulos).
- **Melhorias de estabilidade** na comunicação e sincronização de estado entre portal e apps.

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

- Navegador moderno (Chrome, Edge, Firefox)
- Git (opcional, para clonar)

### Passo a passo

```bash
git clone https://github.com/willianlsz1/portal_senai.git
cd portal_senai
```

Depois, abra localmente o arquivo `index.html` em seu navegador.

Também é possível abrir cada módulo individualmente:

- `senai-mvf/index.html`
- `easa/index.html`

---

## 🧾 Padrão de Commits

Este projeto segue o padrão **Conventional Commits**, facilitando leitura de histórico e organização de releases.

### Prefixos usados

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` refatoração sem alterar regra de negócio
- `style:` ajustes de estilo/formatação

### Exemplos

```bash
feat: adicionar navegação por cards no dashboard
fix: corrigir redirecionamento entre módulos no portal
refactor: reorganizar estrutura src/modules e estilos compartilhados
style: padronizar nomenclatura e indentação do README
```

---

## 🗺️ Roadmap

Melhorias planejadas para as próximas versões:

- [ ] Novos módulos de conteúdo técnico
- [ ] Sistema de autenticação de aluno
- [ ] Rastreamento de progresso de estudo
- [ ] Mais simuladores e exercícios práticos
- [ ] Evolução de métricas de aprendizado

---

## 👨‍💻 Autor

**Willian**  
Desenvolvedor focado em soluções educacionais para formação técnica, com ênfase em automação industrial, organização de conteúdo didático e experiência de aprendizado interativa.
