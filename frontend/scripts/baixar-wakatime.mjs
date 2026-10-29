import { writeFile, readFile } from 'node:fs/promises';
import { normalizarWakatime } from '../src/conteudo/normalizarWakatime.js';

const USUARIO = process.env.WAKATIME_USUARIO ?? '0b484a42-46f5-4d34-8ba3-3241f7e3c703';
const DESTINO = new URL('../src/conteudo/wakatime.json', import.meta.url);
const ENDERECO = `https://wakatime.com/api/v1/users/${USUARIO}/stats/all_time`;

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

try {
  const resposta = await fetch(ENDERECO, { signal: AbortSignal.timeout(15000) });
  if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}`);

  const { data } = await resposta.json();
  const saida = normalizarWakatime(data);
  if (!saida) throw new Error('Resposta sem linguagens');

  await writeFile(DESTINO, JSON.stringify(saida, null, 2) + '\n');
  console.log('[wakatime] Estatísticas atualizadas.');
} catch (erro) {
  await manterOqueExiste(`Não foi possível atualizar: ${erro.message}`);
}
