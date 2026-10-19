// Busca as estatísticas públicas do WakaTime e grava um JSON no repositório.
//
// Por que no build e não no navegador: a API /api/v1 devolve os dados certos
// mas NÃO manda cabeçalho de CORS, então o navegador recusa a leitura. Aqui a
// busca acontece no Node, onde CORS não existe. O endpoint é público e só lê
// o que o perfil expõe, então nenhuma chave entra neste projeto.
//
// O intervalo é 'all_time' porque é o único liberado no plano gratuito.
//
// Rodar: npm run wakatime  (e automaticamente antes de npm run build)

import { writeFile, readFile } from 'node:fs/promises';

const USUARIO = process.env.WAKATIME_USUARIO ?? '0b484a42-46f5-4d34-8ba3-3241f7e3c703';
const DESTINO = new URL('../src/conteudo/wakatime.json', import.meta.url);

/** Nunca derruba o build: o JSON versionado continua valendo. */
async function manterOqueExiste(motivo) {
  console.warn(`[wakatime] ${motivo}`);
  try {
    const atual = JSON.parse(await readFile(DESTINO, 'utf8'));
    console.warn(`[wakatime] Mantido o arquivo de ${atual.atualizadoEm}.`);
  } catch {
    console.warn('[wakatime] Nenhum arquivo anterior: a seção vai aparecer vazia.');
    await writeFile(DESTINO, JSON.stringify({ atualizadoEm: null, linguagens: [] }, null, 2) + '\n');
  }
  process.exit(0); // sempre 0: dado de enfeite não impede publicar o site
}

const endereco = `https://wakatime.com/api/v1/users/${USUARIO}/stats/all_time`;

/**
 * Extrai a data em que a contagem comecou.
 *
 * A API nao devolve a data em formato de maquina no intervalo 'all_time': so o
 * texto 'since Jun 18 2026' em human_readable_range. Convertemos aqui, no
 * build, para que o componente possa formatar no idioma de quem visita em vez
 * de exibir o mes abreviado em ingles.
 */
function dataDeInicio(intervalo) {
  const achado = /since\s+(.+)$/i.exec(intervalo ?? '');
  if (!achado) return null;
  const data = new Date(`${achado[1]} 12:00:00 UTC`);
  return Number.isNaN(data.getTime()) ? null : data.toISOString().slice(0, 10);
}

// Cada grupo conserva o percentual informado pelo WakaTime.
function normalizar(itens = []) {
  return itens.filter((item) => Number.isFinite(item.total_seconds) && item.total_seconds > 0)
    .sort((a, b) => b.total_seconds - a.total_seconds)
    .map((item) => ({ nome: item.name, segundos: Math.round(item.total_seconds),
      percentual: Number.isFinite(item.percent) ? Number(item.percent.toFixed(1)) : 0 }));
}

try {
  const resposta = await fetch(endereco, { signal: AbortSignal.timeout(15000) });
  if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}`);
  const { data } = await resposta.json();
  if (!Array.isArray(data?.languages) || !data.languages.length) throw new Error('Resposta sem linguagens');
  const saida = {
    atualizadoEm: new Date().toISOString().slice(0, 10),
    inicioEm: dataDeInicio(data.human_readable_range),
    diasComRegistro: Number.isFinite(data.days_minus_holidays) ? data.days_minus_holidays : null,
    totalSegundos: Math.round(data.total_seconds),
    mediaDiariaSegundos: Math.round(data.daily_average),
    linguagens: normalizar(data.languages),
    categorias: normalizar(data.categories).filter((item) => !/\bai\b|artificial intelligence/i.test(item.nome)),
    sistemas: normalizar(data.operating_systems),
  };
  await writeFile(DESTINO, JSON.stringify(saida, null, 2) + '\n');
  console.log('[wakatime] Estatísticas atualizadas.');
} catch (erro) {
  await manterOqueExiste(`Não foi possível atualizar: ${erro.message}`);
}
