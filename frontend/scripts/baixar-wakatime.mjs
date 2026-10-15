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
const QUANTAS = 6; // as demais viram uma linha "Outras"

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

let resposta;
try {
  resposta = await fetch(endereco, { signal: AbortSignal.timeout(15000) });
} catch (erro) {
  await manterOqueExiste(`Falha de rede: ${erro.message}`);
}

if (!resposta.ok) {
  await manterOqueExiste(`A API respondeu ${resposta.status}.`);
}

const { data } = await resposta.json();

if (!data?.languages?.length) {
  await manterOqueExiste('A resposta não trouxe linguagens.');
}

const todas = data.languages
  .filter((l) => l.total_seconds > 0)
  .sort((a, b) => b.total_seconds - a.total_seconds);

const principais = todas.slice(0, QUANTAS).map((l) => ({
  nome: l.name,
  segundos: Math.round(l.total_seconds),
  percentual: Number(l.percent.toFixed(1)),
}));

const resto = todas.slice(QUANTAS);
if (resto.length > 0) {
  principais.push({
    nome: null, // o componente traduz para "Outras"
    quantas: resto.length,
    segundos: Math.round(resto.reduce((soma, l) => soma + l.total_seconds, 0)),
    percentual: Number(resto.reduce((soma, l) => soma + l.percent, 0).toFixed(1)),
  });
}

const saida = {
  atualizadoEm: new Date().toISOString().slice(0, 10),
  totalSegundos: Math.round(data.total_seconds),
  mediaDiariaSegundos: Math.round(data.daily_average),
  linguagens: principais,
};

await writeFile(DESTINO, JSON.stringify(saida, null, 2) + '\n');
console.log(`[wakatime] ${principais.length} linhas gravadas · total ${data.human_readable_total}.`);
