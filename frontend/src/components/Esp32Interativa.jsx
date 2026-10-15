import '@google/model-viewer';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import estilos from './FiguraEsp32.module.css';

const ORBITA_INICIAL = '15deg 85deg auto';
const THETA_INICIAL = (15 * Math.PI) / 180;
const DOIS_PI = Math.PI * 2;

/**
 * Traz o angulo para a volta mais proxima da inicial.
 *
 * getCameraOrbit() devolve o theta acumulado: quem girou a placa tres vezes
 * recebe de volta algo como 19rad. Interpolar dali ate 15deg desenrolaria as
 * tres voltas na frente de quem esta olhando. Normalizando, o retorno nunca
 * percorre mais de meia volta.
 */
function maisProximoDoInicio(theta) {
  let normalizado = theta;
  while (normalizado - THETA_INICIAL > Math.PI) normalizado -= DOIS_PI;
  while (THETA_INICIAL - normalizado > Math.PI) normalizado += DOIS_PI;
  return normalizado;
}

export default function Esp32Interativa() {
  const { t } = useTranslation();
  const [erro, setErro] = useState(false);
  const visualizador = useRef(null);

  useEffect(() => {
    const placa = visualizador.current;
    if (!placa) return;
    let timer;
    let retomada;
    let segurando = false;
    let desmontado = false;

    function cancelarRetorno() {
      window.clearTimeout(timer);
      window.clearTimeout(retomada);
    }

    function agendarRetorno() {
      cancelarRetorno();
      if (segurando) return;
      timer = window.setTimeout(async () => {
        // Sincroniza a propriedade com a câmera arrastada antes de voltar.
        const orbita = placa.getCameraOrbit();
        placa.cameraOrbit =
          `${maisProximoDoInicio(orbita.theta)}rad ${orbita.phi}rad ${orbita.radius}m`;
        await placa.updateComplete;
        if (desmontado || segurando) return;
        // Mantem o raio atual em vez de 'auto': voltar para 'auto' faz a
        // camera recalcular a distancia e a placa dar um pulinho de zoom.
        placa.cameraOrbit = `15deg 85deg ${orbita.radius}m`;
        // 1000ms cobre a interpolacao com folga. Com os 800ms anteriores a
        // rotacao automatica entrava antes de a camera assentar, e os dois
        // movimentos brigavam na tela.
        retomada = window.setTimeout(() => { placa.autoRotate = true; }, 1000);
      }, 1500);
    }

    function iniciar() {
      segurando = true;
      cancelarRetorno();
      placa.autoRotate = false;
    }

    function soltar() {
      if (!segurando) return;
      segurando = false;
      agendarRetorno();
    }

    function acompanharCamera(evento) {
      if (evento.detail.source !== 'user-interaction') return;
      placa.autoRotate = false;
      agendarRetorno();
    }

    placa.addEventListener('pointerdown', iniciar);
    placa.addEventListener('camera-change', acompanharCamera);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      desmontado = true;
      cancelarRetorno();
      placa.removeEventListener('pointerdown', iniciar);
      placa.removeEventListener('camera-change', acompanharCamera);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, [erro]);

  if (erro) return (
    <>
      <img className={estilos.imagem} src="/img/esp32.png" alt={t('sobre.esp32_alt')} />
      <p className={estilos.aviso} role="status">{t('sobre.esp32_erro')}</p>
    </>
  );
  return (
    <model-viewer
      ref={visualizador}
      className={estilos.visualizador}
      src="/models/esp32.glb"
      poster="/img/esp32.png"
      alt={t('sobre.esp32_alt')}
      camera-controls
      disable-zoom
      disable-pan
      touch-action="pan-y"
      interaction-prompt="none"
      orientation="0deg 90deg 0deg"
      camera-orbit={ORBITA_INICIAL}
      interpolation-decay="160"
      auto-rotate
      auto-rotate-delay="0"
      rotation-per-second="12deg"
      shadow-intensity="1"
      onError={() => setErro(true)}
    />
  );
}
