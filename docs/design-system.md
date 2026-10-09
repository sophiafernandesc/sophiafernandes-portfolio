# Design System

Documentação das decisões visuais do portfólio. A fonte da verdade é a página
"Design System" do [arquivo do Figma](https://www.figma.com/design/rZBIBF1oWuGe6IK20gs4RA/Portfolio),
espelhada em [`frontend/src/styles/tokens.css`](../frontend/src/styles/tokens.css).

> **Regra que sustenta tudo:** nenhum valor literal de cor ou tamanho dentro de
> um CSS Module. Se faltar um token, ele nasce no `tokens.css` primeiro. É isso
> que torna o tema claro viável — sem essa disciplina, cada cor fixa vira uma
> exceção a caçar depois.

---

## Dois temas

Exigência da disciplina: escuro como padrão, claro disponível. Os dois saem dos
mesmos tokens. O escuro vive em `:root`; o claro sobrescreve **somente as cores**
em `:root[data-tema='claro']`. Tipografia, espaçamento e layout são comuns aos
dois e ficam declarados uma única vez.

O atributo `data-tema` é escrito no `<html>` pelo `TemaProvider`. No tema escuro
ele é **removido**, não definido como `escuro` — assim o `:root` padrão vale e o
site continua legível mesmo se o JavaScript falhar.

O `color-scheme` acompanha cada tema. Sem ele, campo de formulário, barra de
rolagem e menu suspenso nativos continuam claros sobre o fundo escuro.

### Paleta

| Token | Escuro | Claro | Papel |
| :--- | :--- | :--- | :--- |
| `--cor-fundo` | `#0a090d` | `#faf9fb` | fundo da página |
| `--cor-superficie` | `#141218` | `#ffffff` | card, cabeçalho |
| `--cor-superficie-elevada` | `#1f1b29` | `#f2f0f6` | chip, janela da capa |
| `--cor-borda` | `#26222f` | `#ddd7e9` | separação sutil |
| `--cor-borda-forte` | `#3a3348` | `#9b8fb4` | contorno de campo e chip |
| `--cor-acento-forte` | `#8f74ea` | `#6d4ae0` | fundo do botão principal |
| `--cor-acento` | `#a78bfa` | `#5b3cc4` | link, rótulo, estado ativo |
| `--cor-acento-contraste` | `#140f28` | `#ffffff` | texto sobre o acento forte |
| `--cor-texto` | `#e8e6ee` | `#1a1721` | título, texto forte |
| `--cor-texto-secundario` | `#b9b3c6` | `#4a4458` | parágrafo, item de lista |
| `--cor-texto-apagado` | `#857e95` | `#6e6880` | rótulo de metadado |
| `--cor-texto-sutil` | `#837c99` | `#736c82` | legenda, placeholder |
| `--cor-texto-controle` | `#cec9dc` | `#5f5973` | chip e botão secundário |
| `--cor-chip-ativo` | `#2e2744` | `#e7e0fb` | fundo do filtro selecionado |
| `--cor-campo-fundo` | `#191720` | `#ffffff` | input e textarea |
| `--cor-erro` | `#d98a8a` | `#b3261e` | campo inválido |

### Por que o acento troca de valor

Não é capricho: `#a78bfa` dá 2,2:1 sobre fundo claro, bem abaixo do mínimo. O
papel de "acento legível" passa para um roxo mais fechado no tema claro.

E o `--cor-acento-contraste` **inverte**: texto escuro sobre o botão roxo no
tema escuro, branco no claro. O acento forte do tema escuro também foi clareado
de `#7c5ce6` para `#8f74ea` — com o texto escuro por cima, o valor antigo dava
4,01:1 e reprovava.

---

## Contraste

Mínimo de **4.5:1** para texto nos dois temas, sem exceção. Valores medidos pelo
cálculo de luminância relativa da WCAG 2.1, sobre `--cor-fundo` (ou sobre a
superfície onde o token de fato vive):

| Token | Escuro | | Claro | |
| :--- | :--- | ---: | :--- | ---: |
| `--cor-texto` | `#e8e6ee` | 16,06:1 | `#1a1721` | 16,84:1 |
| `--cor-texto-secundario` | `#b9b3c6` | 9,76:1 | `#4a4458` | 8,86:1 |
| `--cor-texto-apagado` | `#857e95` | 5,12:1 | `#6e6880` | 5,06:1 |
| `--cor-texto-sutil` | `#837c99` | 5,02:1 | `#736c82` | 4,77:1 |
| `--cor-texto-controle` | `#cec9dc` | 10,43:1 | `#5f5973` | 5,87:1 |
| `--cor-acento` (link) | `#a78bfa` | 7,29:1 | `#5b3cc4` | 6,93:1 |
| `--cor-acento-contraste` | `#140f28` | 5,19:1 | `#ffffff` | 5,67:1 |
| `--cor-erro` | `#d98a8a` | 7,52:1 | `#b3261e` | 6,23:1 |

A `--cor-borda-forte` do tema claro vale **3,01:1** sobre o campo branco. Esse é
o limite da WCAG 1.4.11 para o contorno que **identifica** um controle — com o
valor anterior os campos de formulário sumiam no fundo.

---

## Tipografia

Inter no texto corrido, Geist Mono em título, menu e metadado. Mono em título é
escolha estética deliberada (referência: [tjklint.github.io](https://tjklint.github.io/));
a prosa longa fica em Inter porque as páginas Sobre e de projeto têm texto de
leitura, e mono cansa em parágrafo.

| Token | Valor | Uso |
| :--- | ---: | :--- |
| `--tam-display` | 54px | nome na home |
| `--tam-h1` | 40px | título de página |
| `--tam-h2` | 24px | seção |
| `--tam-h3` | 18px | título de card |
| `--tam-corpo` | 16px | texto corrido |
| `--tam-corpo-peq` | 14px | resumo, botão |
| `--tam-menu` | 13px | menu, controles |
| `--tam-rotulo` | 11px | metadado, chip, legenda |

Abaixo de 768px, `--tam-display` cai para 32px e `--tam-h1` para 28px. Títulos em
mono levam `letter-spacing: -0.02em`: o avanço da mono é largo e, sem isso, o
display esparrama.

---

## Espaçamento e layout

Escala de espaçamento em múltiplos de 4px: `--esp-1` (4px) a `--esp-16` (64px).

| Token | Valor | Uso |
| :--- | ---: | :--- |
| `--largura-maxima` | 1440px | limite do conteúdo |
| `--gutter` | 64px | margem lateral (20px no celular) |
| `--largura-leitura` | 46rem | limite de linha do texto corrido |
| `--raio` | 10px | card, janela |
| `--raio-peq` | 6px | botão, chip, campo |

---

## Regras de uso

### Um acento por tela

No máximo **um** botão preenchido com `--cor-acento-forte` por página. Acento
repetido deixa de significar "aqui" e vira papel de parede. Os demais botões
usam contorno com `--cor-borda-forte`. Link, rótulo de seção e estado ativo do
menu usam `--cor-acento`, que é o acento legível, não o de preenchimento.

### Separadores

| Sinal | Uso | Exemplo |
| :---: | :--- | :--- |
| `·` | metadados em sequência | `2025 · 02 · Belo Horizonte` |
| `-` | intervalo | `2024/1 - 2026/1` |
| `—` | **nunca** | travessão não é usado em lugar nenhum do site |

A ausência do travessão é verificável: `grep -r "—" frontend/src frontend/index.html`
deve retornar vazio.

### Fundo quadriculado

A classe utilitária `.grade`, no `global.css`, desenha uma grade de 28px com dois
gradientes lineares. Dá ar de painel técnico sem gritar. Usada só em blocos de
destaque — nunca na página inteira, nunca atrás de texto corrido. A linha usa
`--cor-superficie`, então acompanha os dois temas sozinha.

Regra: se a grade está visível a ponto de você reparar nela, está forte demais.

### Capas de projeto

Cada capa vive dentro de uma moldura de janela, com barra de título e três
pontos neutros. O enquadramento comum é o que permite conviver material de
naturezas diferentes — captura de tela, card de título, foto de hardware
recortada — sem que cada card pareça de um site diferente.

O slot é `16 / 9`, a mesma proporção das capas, então `object-fit: cover` não
tem o que cortar. Projeto sem capa cai no mesmo espaço reservado, dentro da
mesma moldura, mantendo o ritmo da coluna.

---

## Acessibilidade

Não negociável, e verificado a cada alteração:

- Contraste mínimo 4.5:1 para texto nos dois temas.
- Todo controle alcançável por teclado, com `:focus-visible` visível. Alvo de
  foco programático (o `<main>` na troca de rota) não leva anel: ele recebe foco
  só para o leitor de tela anunciar a página nova.
- Link "pular para o conteúdo" no topo, antes do menu.
- Troca de rota move o foco para o `<main>` e sobe o scroll, com
  `preventScroll` para o cabeçalho fixo não cobrir o título.
- `alt` descritivo em toda imagem; decoração leva `aria-hidden`.
- `prefers-reduced-motion` respeitado globalmente.
- `<html lang>` acompanha o idioma escolhido.
