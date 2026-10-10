import { lazy, Suspense, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import estilos from './FiguraEsp32.module.css';

const Esp32Interativa = lazy(() => import('./Esp32Interativa'));
const CONSULTA_ESTATICA = '(prefers-reduced-motion: reduce), (max-width: 860px)';

function observarPreferencia(notificar) {
  const consulta = window.matchMedia(CONSULTA_ESTATICA);
  consulta.addEventListener('change', notificar);
  return () => consulta.removeEventListener('change', notificar);
}

function lerPreferencia() {
  return window.matchMedia(CONSULTA_ESTATICA).matches;
}

export default function FiguraEsp32() {
  const { t } = useTranslation();
  const estatica = useSyncExternalStore(observarPreferencia, lerPreferencia, () => true);
  const [ativada, setAtivada] = useState(false);
  const imagem = <img className={estilos.imagem} src="/img/esp32.png" alt={t('sobre.esp32_alt')} width="800" height="500" />;

  return (
    <figure className={estilos.figura}>
      <div className={estilos.painel}>
        {ativada && !estatica ? (
          <Suspense fallback={imagem}><Esp32Interativa /></Suspense>
        ) : imagem}
        {!ativada && !estatica && (
          <button className={estilos.botao} type="button" onClick={() => setAtivada(true)}>
            {t('sobre.esp32_ativar')}
          </button>
        )}
      </div>
      <figcaption className="metadado">
        {t('sobre.esp32_legenda')}{' '}
        <a href="https://sketchfab.com/3d-models/esp32-78c2b5a932a1463bbc6e8ada630a0545" target="_blank" rel="noopener noreferrer">Davyd Tovstyj</a>
        {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
      </figcaption>
      {ativada && !estatica && <p className="metadado">{t('sobre.esp32_controles')}</p>}
    </figure>
  );
}
