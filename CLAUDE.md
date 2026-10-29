# Portfólio profissional — contexto do projeto

Arquivo de contexto para o Claude Code. Leia antes de qualquer alteração.

## O que é

Site de portfólio profissional de **Sophia da Costa Fernandes**, entregue como
**Laboratório 01 (LAB01)** da disciplina **DIAW — Desenvolvimento e Integração de
Aplicações Web**, Engenharia de Software, PUC Minas, 2026/2. Professor: João Paulo
Aramuni. Vale 15 pontos, divididos em três sprints.

Além da nota, o site é peça real de apresentação profissional e continua no ar
depois da entrega.

## Posicionamento

Desenvolvimento de software com **origem em eletrônica e sistemas embarcados**.
A primeira dobra fala software; a trajetória hardware → full-stack é o diferencial
e é contada pela timeline de projetos, do robô quadrúpede em C++ (2024) à
plataforma em Spring Boot (2026).

Nunca descreva a autora como "estudante iniciante": ela atuou como estagiária de engenharia
na Stellantis, em validação de infotainment e conectividade. O estágio começou em
junho/2025 e terminou em setembro/2026 (1 ano e 3 meses). Atualmente participa da extensão
WebTech na PUC Minas.

## Stack

**Front-end:** React 19 · Vite 8 · MDX 3 · React Router · react-i18next · CSS Modules
**Back-end (Sprints 02–03):** Java 25 · Spring Boot 3.3 · stateless, sem banco
**Hospedagem:** Vercel (front, estático) e Render (back)
**Domínio:** `sophiafernandes.dev`, já adquirido. O apex é a URL canônica; `www`
redireciona para ele. `.dev` está na lista HSTS preload, então HTTPS é obrigatório —
não existe fallback em http. Toda URL absoluta do projeto (meta tags Open Graph,
sitemap, `CORS_ORIGIN` do back-end) usa esse domínio.

### Por que essa divisão

O conteúdo é estático e carrega instantâneo; planos gratuitos de back-end hibernam
e o primeiro acesso paga o custo de acordar. Mantendo o site estático, esse custo
nunca recai sobre quem abre a página.

O back-end existe por um motivo só: **segredo não pode ir para o cliente**.
Credencial de SMTP e secret key do reCAPTCHA ficam no servidor, e é por isso que
a validação dos campos é repetida lá — o cliente é público e pode ser
contornado.

O WakaTime **não** passa por ele: o repasse acontece na borda da Vercel, porque
lá não há hibernação e não há credencial a proteger.

### Endpoints

| Endpoint | Função |
|---|---|
| `POST /api/contact` | Envio do formulário por SMTP, com reCAPTCHA conferido antes |
| `GET /api/health` | Acorda a instância quando a página de contato abre |

O terminal "Pergunte sobre mim" com Gemini foi **cortado do escopo** e não está
no enunciado. Não retomar sem a autora pedir.

Estatísticas do WakaTime: leitura anônima do perfil público, sem chave de API
em lugar nenhum. O caminho tem duas pernas, e as duas são necessárias:

- **No build**, `scripts/baixar-wakatime.mjs` grava `src/conteudo/wakatime.json`.
  É esse arquivo que aparece instantâneo quando a página abre.
- **Em tempo de execução**, o componente busca `GET /api/wakatime` e troca pelos
  números frescos quando chegam. Sem isso, os dados congelariam na data do
  último deploy.

**O repasse acontece na borda, não no back-end.** A API pública do WakaTime não
envia `Access-Control-Allow-Origin`, então o navegador recusa a leitura direta.
Quem repassa é a hospedagem: o rewrite do `vercel.json` em produção, o
`server.proxy` do `vite.config.js` em desenvolvimento. Assim as estatísticas
não dependem de acordar a instância do Render, que hiberna.

Não implementar endpoint WakaTime no Spring Boot: o motivo não é credencial
(não há nenhuma, o perfil é público), é que a borda responde sempre e o back-end
não. A normalização mora em `src/conteudo/normalizarWakatime.js` e serve ao
script e ao componente — não duplicá-la em Java.

Sem banco de dados nesta entrega. O livro de visitas foi cortado do escopo e está
no backlog — é ele que traz o banco de volta, depois da disciplina.

## Estrutura

```
/docs                  design-system.md e wireframes exportados do Figma
/frontend
  /src
    /components        Nav, Footer, Layout, CardProjeto, Neofetch, SecaoVazia
    /pages             Home, Sobre, Projetos, ProjetoDetalhe, Experiencias, Contato
    /conteudo          conteúdo em MDX, bilíngue
      projetos.js      varre as pastas e exporta a lista ordenada
      /projetos/pt     spindle, diagnosticar, voltra, programacao-modular, cod-invest, portfolio
      /projetos/en     os mesmos arquivos, em inglês
      /sobre           pt.mdx e en.mdx
      /experiencias    pt.mdx e en.mdx
      wakatime.json    gravado no build, primeira renderização
      normalizarWakatime.js  um normalizador para o script e o componente
    /locales           pt/comum.json e en/comum.json — só strings de interface
    /styles            tokens.css, global.css, mdxComponents.jsx
    /services          chamadas de rede: contato.js (back-end) e wakatime.js (borda)
    /hooks             useIdioma
    /config            links.js
/backend               Spring Boot (Sprint 02)
```

## Convenções

**Idioma do código:** nomes de componentes, variáveis, funções e arquivos em
**português**. Comentários em português. É consistente com o resto do projeto.

**Cores e tamanhos só por token.** Nenhum valor literal em CSS Module. Se faltar um
token, crie em `tokens.css` primeiro. Essa regra é o que torna o tema claro viável.

**i18next só para strings de interface** — menu, rótulos, botões, mensagens de erro.
Texto longo vive em `.mdx`. Parágrafo dentro de arquivo de tradução é o caminho mais
curto para um `i18n.js` de milhares de linhas (o do professor tem 4.527).

**Conteúdo bilíngue desde o primeiro arquivo.** Toda pasta de conteúdo tem `pt/` e
`en/` lado a lado. Adaptar i18n depois é o pior retrabalho possível.

**CSS Modules**, um arquivo por componente, mesmo nome.

**MDX:** cada projeto é um arquivo com frontmatter padronizado (`slug`, `titulo`,
`ano`, `ordem`, `stack`, `repo`, `capa`, `tags`, `destaque`) e corpo livre. O
frontmatter alimenta os cards e a ordenação; o corpo vira a página de detalhe.
Publicar projeto novo = criar arquivo, preencher, `git push`.

## Design System

Fonte da verdade: a página "Design System" do
[arquivo do Figma](https://www.figma.com/design/rZBIBF1oWuGe6IK20gs4RA/Portfolio),
espelhada em `src/styles/tokens.css` e documentada em `docs/design-system.md`.

**Dois temas definidos para o projeto** (decisão de design): escuro como padrão, claro
disponível. Os dois saem dos mesmos tokens, trocados por `:root[data-tema='claro']`.
O `color-scheme` tem que acompanhar, senão campos de formulário e scrollbar ficam
brancos no tema escuro.

O **acento muda de valor entre os temas**: `#a78bfa` não tem contraste suficiente
sobre fundo claro. E `--cor-acento-contraste` inverte — texto escuro sobre o botão
roxo no tema escuro, branco no claro.

**Regra de ouro: um acento por tela.** No máximo um botão preenchido com o acento
forte por página. Acento repetido deixa de significar "aqui" e vira papel de parede.

**Tipografia:** Inter no texto corrido, Geist Mono em metadados, números, menu e
títulos. Mono em título é escolha estética deliberada (referência: tjklint.github.io);
texto corrido fica em Inter porque as páginas de Sobre e de projeto têm prosa longa.

**Separadores:** ponto médio (·) separa metadados em sequência. O hífen fica
reservado para intervalo, como em `2024/1 - 2026/1`. Travessão não é usado em
lugar nenhum do site.

**Fundo quadriculado:** a classe utilitária `.grade`, no `global.css`, desenha uma
grade sutil de 28px com dois gradientes lineares. É o que dá o ar de painel técnico
sem gritar. Usada só em blocos de destaque — nunca na página inteira, nunca atrás de
texto corrido. A linha da grade usa `--cor-superficie`, então ela acompanha os dois
temas sozinha. Regra: se a grade está visível a ponto de você reparar nela, está
forte demais.

## Acessibilidade — não negociável

- Contraste mínimo 4.5:1 para texto nos dois temas.
- Todo controle alcançável por teclado, com `:focus-visible` visível.
- Link "pular para o conteúdo" no topo.
- Troca de rota move o foco para o `<main>` e sobe o scroll.
- `alt` descritivo em toda imagem; decoração leva `aria-hidden`.
- `prefers-reduced-motion` respeitado.
- `<html lang>` acompanha o idioma escolhido.

## Performance

Orçamento: **até 200 KB comprimidos na rota inicial**. O bundle atual é ~132 KB.

Peças pesadas (modelo da ESP32 na página Sobre) entram por `React.lazy` em chunk
separado, com imagem estática de fallback em celular e sob `prefers-reduced-motion`.
Nunca no bundle inicial.

## Escopo por sprint

### Lab01S01 — planejamento e prototipação (4 pontos) — CONCLUÍDA

Repositório com README inicial, wireframes no Figma, protótipo inicial do front-end,
navegação e layout principal. Entrega: README com imagens dos protótipos, descrição,
tecnologias previstas e estrutura inicial.

### Lab01S02 — funcionalidades (4 pontos) — ATUAL

Sobre Mim nos dois idiomas, timeline dinâmica, Experiências, Contato com ícones e
formulário funcional, validações e responsividade. Back-end com `/api/contact`, desenvolvido à parte e integrado antes da entrega.
O formulário precisa enviar e-mail de verdade para a Sprint 02 estar concluída.
reCAPTCHA v2 é uma decisão adicional do projeto, validado no servidor.
Capas e GIFs dos projetos podem ser finalizados na Sprint 03, conforme o enunciado.

### Lab01S03 — hospedagem e finalização (7 pontos)

Deploy na Vercel e no Render, modelo da ESP32 na página Sobre,
terminal "Pergunte sobre mim" com Gemini e rate limit por IP, README final.

## O que NÃO fazer agora

O crachá 3D com cordão e física foi cancelado. A Home terá um card de foto.
A ESP32 permanece na página Sobre; não movê-la para a Home.
Não instale `@react-three/*` nem `@react-three/rapier`.
Não mostrar planejamento de sprint como legenda para visitantes.
Não implementar o back-end nesta tarefa de front-end.
Não fazer commit, merge, push ou deploy antes da revisão da autora.

## Decisões já tomadas (não reabrir sem motivo)

| Decisão | Motivo |
|---|---|
| Conteúdo em MDX, não em banco | Versionado no Git, sem painel para manter |
| Back-end separado, não monolito | O site nunca sofre com cold start |
| Sem banco de dados | Nada a persistir nesta entrega |
| Repasse do WakaTime na borda | Falta CORS na API deles, mas a borda responde sempre e o Render hiberna |
| Envio por relay na porta 2525 | O plano gratuito do Render bloqueia as portas SMTP 25, 465 e 587 |
| Pastas bilíngues desde o início | Retrofitar i18n é o pior refactor |
| Acento roxo, base escura | Cor favorita da autora, e diferencia das referências |
| Sem terminal interativo como navegação | Contraintuitivo para quem não é da área; ruim em celular |
| Card de foto na Home, sem crachá 3D | Apresentação pessoal simples e orçamento de bundle menor |
| ESP32 somente na página Sobre | Conecta a trajetória ao hardware sem competir com a apresentação |

## Git

Uma branch por sprint: `lab01s01`, `lab01s02`, `lab01s03`. No fim de cada sprint,
`git merge --no-ff` na `main` — o commit de merge preserva onde cada sprint começou
e terminou, o que ajuda na apresentação.

Mensagens em [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.

## Referências de design

- [raphaelsena.com](https://www.raphaelsena.com/) — conceito forte, 3D como figura legendada
- [azal.im](https://azal.im/) — menu centralizado, densidade de evidência
- [abdulmomin.dev](https://abdulmomin.dev/) — formulário em casca de IDE, fundo quadriculado
- [aramuni.dev](https://aramuni.dev/) — formato dos cards de projeto (é o professor)
- [tjklint.github.io](https://tjklint.github.io/) — tipografia mono nos títulos