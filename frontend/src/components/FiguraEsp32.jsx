import { lazy, Suspense, useSyncExternalStore } from 'react';
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
  const imagem = <img className={estilos.imagem} src="/img/esp32.png" alt={t('sobre.esp32_alt')} width="800" height="500" />;

  return (
    <figure className={estilos.figura}>
      <div className={estilos.painel}>
        {!estatica ? (
          <Suspense fallback={imagem}><Esp32Interativa /></Suspense>
        ) : imagem}
      </div>
    </figure>
  );
}
