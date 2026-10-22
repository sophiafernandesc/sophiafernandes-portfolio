const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/**
 *
 * A instância gratuita do Render hiberna, e acordar leva perto de um minuto.
 * Chamada quando a página de contato abre, essa espera acontece enquanto a
 * pessoa preenche o formulário, em vez de depois que ela clica em enviar.
 */
export function acordarApi() {
  return fetch(`${BASE}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});
}

/** Envia o formulário de contato ao back-end. Lança em caso de falha. */
export async function enviarContato({ nome, email, mensagem, tokenRecaptcha }) {
  const resposta = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, mensagem, tokenRecaptcha }),
  });
  if (!resposta.ok) {
    const erro = new Error(`Falha no envio: ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return resposta.json().catch(() => ({}));
}
