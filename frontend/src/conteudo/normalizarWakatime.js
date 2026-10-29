
export const INICIO_DECLARADO = '2026-08-31';

function diasDesde(iso) {
  if (!iso) return null;
  const inicio = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(inicio.getTime())) return null;
  return Math.max(1, Math.round((Date.now() - inicio.getTime()) / 86400000));
}

function normalizarGrupo(itens = []) {
  return itens
    .filter((item) => Number.isFinite(item.total_seconds) && item.total_seconds > 0)
    .sort((a, b) => b.total_seconds - a.total_seconds)
    .map((item) => ({
      nome: item.name,
      segundos: Math.round(item.total_seconds),
      percentual: Number.isFinite(item.percent) ? Number(item.percent.toFixed(1)) : 0,
    }));
}

/**
 * @param dados o objeto `data` da resposta de /stats/all_time
 * @returns null quando a resposta não traz linguagens, para o chamador
 *          decidir se mantém o que já tinha
 */
export function normalizarWakatime(dados) {
  if (!Array.isArray(dados?.languages) || !dados.languages.length) return null;

  return {
    atualizadoEm: new Date().toISOString().slice(0, 10),
    inicioEm: INICIO_DECLARADO,
    diasComRegistro: Number.isFinite(dados.days_minus_holidays) ? dados.days_minus_holidays : null,
    diasTotais: diasDesde(INICIO_DECLARADO)
      ?? (Number.isFinite(dados.days_including_holidays) ? dados.days_including_holidays : null),
    totalSegundos: Math.round(dados.total_seconds),
    mediaDiariaSegundos: Math.round(dados.daily_average),
    linguagens: normalizarGrupo(dados.languages),
    editores: normalizarGrupo(dados.editors),
    categorias: normalizarGrupo(dados.categories)
      .filter((item) => !/\bai\b|artificial intelligence/i.test(item.nome)),
    sistemas: normalizarGrupo(dados.operating_systems),
  };
}
