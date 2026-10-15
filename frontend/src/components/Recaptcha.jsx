import { useEffect, useRef } from 'react';
import useIdioma from '../hooks/useIdioma';
import { useTema } from '../theme/TemaProvider';
import estilos from './Recaptcha.module.css';

const CHAVE_SITE = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// O script do Google fixa o idioma no momento em que carrega: trocar de idioma
// não é re-renderizar o widget, é derrubar o script e trazer outro. Por isso o
// carregamento mora fora do componente, guardado por idioma.
let carregamento = null;
let idiomaDoScript = null;

function carregarScript(idioma) {
  const hl = idioma === 'en' ? 'en' : 'pt-BR';
  if (carregamento && idiomaDoScript === hl) return carregamento;

  document.querySelectorAll('script[data-recaptcha]').forEach((s) => s.remove());
  delete window.grecaptcha;

  idiomaDoScript = hl;
  carregamento = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${hl}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    script.onload = () => window.grecaptcha.ready(resolve);
    script.onerror = () => reject(new Error('o script do reCAPTCHA não carregou'));
    document.head.appendChild(script);
  });
  return carregamento;
}

/**
 * Caixa "não sou um robô" do reCAPTCHA v2.
 *
 * O pai remonta este componente trocando a `key` quando o tema ou o idioma
 * mudam: o grecaptcha não troca nenhum dos dois com o widget já desenhado.
 *
 * @param aoMudarToken recebe o token, ou null quando expira ou falha
 * @param aoFalhar     chamado quando o widget não pôde sequer ser desenhado
 * @param reiniciar    number; mudar o valor limpa a caixa (use após enviar)
 */
export default function Recaptcha({ aoMudarToken, aoFalhar, reiniciar = 0 }) {
  const caixa = useRef(null);
  const widget = useRef(null);
  const idioma = useIdioma();
  const { tema } = useTema();

  // Guardar os callbacks em ref evita redesenhar o widget só porque o pai
  // recriou as funções no render. A escrita vai num efeito, não no corpo do
  // componente: mexer em ref durante o render não é seguro.
  const retornos = useRef({ aoMudarToken, aoFalhar });
  useEffect(() => {
    retornos.current = { aoMudarToken, aoFalhar };
  });

  useEffect(() => {
    if (!CHAVE_SITE) return undefined;
    let vivo = true;

    carregarScript(idioma)
      .then(() => {
        // widget.current já preenchido = efeito rodou duas vezes (StrictMode).
        if (!vivo || !caixa.current || widget.current !== null) return;
        widget.current = window.grecaptcha.render(caixa.current, {
          sitekey: CHAVE_SITE,
          theme: tema === 'claro' ? 'light' : 'dark',
          callback: (token) => retornos.current.aoMudarToken(token),
          'expired-callback': () => retornos.current.aoMudarToken(null),
          'error-callback': () => {
            retornos.current.aoMudarToken(null);
            retornos.current.aoFalhar?.();
          },
        });
      })
      .catch(() => {
        if (vivo) retornos.current.aoFalhar?.();
      });

    return () => { vivo = false; };
  }, [idioma, tema]);

  // Limpa a caixa depois de um envio bem-sucedido: o token é de uso único.
  useEffect(() => {
    if (reiniciar === 0 || widget.current === null) return;
    window.grecaptcha?.reset(widget.current);
    retornos.current.aoMudarToken(null);
  }, [reiniciar]);

  if (!CHAVE_SITE) {
    // Clone novo sem .env.local: avisa em vez de quebrar o formulário inteiro.
    return <p className="metadado">VITE_RECAPTCHA_SITE_KEY não configurada.</p>;
  }

  return <div className={estilos.caixa} ref={caixa} />;
}
