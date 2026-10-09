// Varre as pastas de conteúdo e devolve os projetos já ordenados.
//
// O import.meta.glob precisa de caminho LITERAL: não dá para interpolar o
// idioma dentro da string. Por isso os dois globs são declarados aqui e a
// escolha acontece em tempo de execução, no getProjetos().
//
// eager: true coloca tudo no bundle inicial. Para os cards isso é o certo,
// porque a timeline precisa do frontmatter de todos de uma vez. Quando o corpo
// das páginas de detalhe crescer, vale separar: frontmatter eager aqui e corpo
// em import dinâmico por rota.
const modulos = {
  pt: import.meta.glob('./projetos/pt/*.mdx', { eager: true }),
  en: import.meta.glob('./projetos/en/*.mdx', { eager: true }),
};

const IDIOMAS = Object.keys(modulos);
const IDIOMA_PADRAO = 'pt';

const slugDe = (caminho, modulo) =>
  modulo.frontmatter?.slug ?? caminho.split('/').pop().replace('.mdx', '');

/** Indexa um idioma por slug, para conseguir parear os dois lados. */
function indexar(mapa) {
  const porSlug = new Map();
  for (const [caminho, modulo] of Object.entries(mapa)) {
    porSlug.set(slugDe(caminho, modulo), modulo);
  }
  return porSlug;
}

const indice = Object.fromEntries(
  IDIOMAS.map((lng) => [lng, indexar(modulos[lng])])
);

/* Conjunto completo de projetos: a união dos slugs dos dois idiomas. Usar a
   união, e não só o idioma pedido, é o que faz um projeto escrito em apenas
   uma língua continuar aparecendo na outra em vez de sumir da timeline. */
const TODOS_OS_SLUGS = [...new Set(IDIOMAS.flatMap((lng) => [...indice[lng].keys()]))];

/* Proteção 1: quem não tem par cai no outro idioma.
   Sem isso, esquecer o arquivo em inglês tira o projeto da timeline em inglês
   sem quebrar o build, e o erro só aparece quando alguém troca o idioma. */
function resolver(slug, idioma) {
  const preferido = indice[idioma]?.get(slug);
  if (preferido) return { modulo: preferido, idiomaConteudo: idioma };

  for (const lng of [IDIOMA_PADRAO, ...IDIOMAS]) {
    const reserva = indice[lng]?.get(slug);
    if (reserva) return { modulo: reserva, idiomaConteudo: lng };
  }
  return null;
}

function montar(idioma) {
  return TODOS_OS_SLUGS.map((slug) => {
    const achado = resolver(slug, idioma);
    if (!achado) return null;
    const { modulo, idiomaConteudo } = achado;
    return {
      ...modulo.frontmatter,
      slug,
      Corpo: modulo.default,
      // Quando difere do idioma pedido, o corpo veio traduzido de outra pasta.
      // A interface pode usar isso para avisar o visitante. Sprint 02.
      idiomaConteudo,
    };
  })
    .filter(Boolean)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

/* Proteção 2: aviso em desenvolvimento para quem está sem par.
   Roda uma vez, na carga do módulo, e some do bundle de produção porque o
   import.meta.env.DEV vira false e o bloco é eliminado no build. */
if (import.meta.env.DEV) {
  const faltando = [];
  for (const slug of TODOS_OS_SLUGS) {
    const ausentes = IDIOMAS.filter((lng) => !indice[lng].has(slug));
    if (ausentes.length) faltando.push(`${slug} (falta ${ausentes.join(', ')})`);
  }
  if (faltando.length) {
    console.warn(
      `[conteudo] ${faltando.length} projeto(s) sem versão em todos os idiomas:\n  ` +
        faltando.join('\n  ') +
        '\n  O conteúdo cai no idioma disponível. Crie o arquivo que falta antes de publicar.'
    );
  }
}

const cache = {};

/** Todos os projetos do idioma, do mais antigo ao mais recente. */
export function getProjetos(idioma = IDIOMA_PADRAO) {
  const lng = indice[idioma] ? idioma : IDIOMA_PADRAO;
  cache[lng] ??= montar(lng);
  return cache[lng];
}

/** Um projeto pelo slug, ou undefined. */
export function getProjeto(slug, idioma = IDIOMA_PADRAO) {
  return getProjetos(idioma).find((p) => p.slug === slug);
}

/** Lista única de tags, para os filtros da página de projetos. */
export function getTags(idioma = IDIOMA_PADRAO) {
  const tags = getProjetos(idioma).flatMap((p) => p.tags ?? []);
  return [...new Set(tags)];
}
