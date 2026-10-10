import { useEffect, useState, useSyncExternalStore } from 'react';
import estilos from './TextoDigitando.module.css';

const CONSULTA_MOVIMENTO = '(prefers-reduced-motion: reduce)';

function observarMovimento(notificar) {
  const consulta = window.matchMedia(CONSULTA_MOVIMENTO);
  consulta.addEventListener('change', notificar);
  return () => consulta.removeEventListener('change', notificar);
}

function lerMovimento() {
  return window.matchMedia(CONSULTA_MOVIMENTO).matches;
}

export default function TextoDigitando({ frases }) {
  const reduzirMovimento = useSyncExternalStore(observarMovimento, lerMovimento, () => true);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    if (reduzirMovimento || !frases.length) return;
    let indice = 0;
    let caracteres = 0;
    let apagando = false;
    let timer;

    function avancar() {
      const frase = frases[indice];
      caracteres += apagando ? -1 : 1;
      setTexto(frase.slice(0, caracteres));
      let intervalo = apagando ? 45 : 85;
      if (!apagando && caracteres === frase.length) {
        apagando = true;
        intervalo = 1800;
      } else if (apagando && caracteres === 0) {
        apagando = false;
        indice = (indice + 1) % frases.length;
        intervalo = 350;
      }
      timer = window.setTimeout(avancar, intervalo);
    }

    timer = window.setTimeout(avancar, 350);
    return () => window.clearTimeout(timer);
  }, [frases, reduzirMovimento]);

  return (
    <div className={estilos.linha} aria-hidden="true">
      <span>&gt; </span>
      <span>{reduzirMovimento ? frases[0] : texto}</span>
      <span>_</span>
    </div>
  );
}
