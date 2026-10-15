const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/** Envia o formulário de contato ao back-end. Lança em caso de falha. */
export async function enviarContato({ nome, email, mensagem, tokenRecaptcha }) {
  const resposta = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, mensagem, tokenRecaptcha }),
  });
  if (!resposta.ok) {
    // O status distingue "o reCAPTCHA recusou" (400) de "o servidor falhou"
    // (5xx), e é isso que escolhe a mensagem mostrada na tela.
    const erro = new Error(`Falha no envio: ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return resposta.json().catch(() => ({}));
}
