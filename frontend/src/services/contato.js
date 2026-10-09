const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/** Envia o formulário de contato ao back-end. Lança em caso de falha. */
export async function enviarContato({ nome, email, mensagem }) {
  const resposta = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, mensagem }),
  });
  if (!resposta.ok) throw new Error(`Falha no envio: ${resposta.status}`);
  return resposta.json().catch(() => ({}));
}
