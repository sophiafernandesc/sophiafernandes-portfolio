import '@google/model-viewer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import estilos from './FiguraEsp32.module.css';

export default function Esp32Interativa() {
  const { t } = useTranslation();
  const [erro, setErro] = useState(false);
  if (erro) return (
    <>
      <img className={estilos.imagem} src="/img/esp32.png" alt={t('sobre.esp32_alt')} />
      <p className={estilos.aviso} role="status">{t('sobre.esp32_erro')}</p>
    </>
  );
  return (
    <model-viewer
      className={estilos.visualizador}
      src="/models/esp32.glb"
      poster="/img/esp32.png"
      alt={t('sobre.esp32_alt')}
      camera-controls
      disable-zoom
      touch-action="pan-y"
      interaction-prompt="none"
      camera-orbit="35deg 55deg auto"
      shadow-intensity="1"
      onError={() => setErro(true)}
    />
  );
}
