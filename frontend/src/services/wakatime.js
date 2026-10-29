export async function buscarWakatime() {
  const resposta = await fetch('/api/wakatime');
  if (!resposta.ok) throw new Error(`Falha ao buscar estatísticas: ${resposta.status}`);

  /* O WakaTime embrulha tudo num campo `data`, e o rewrite repassa a resposta
     inteira. Desembrulhamos aqui para o normalizador receber sempre a mesma
     forma, venha de onde vier. */
  const corpo = await resposta.json();
  return corpo?.data ?? corpo;
}
