import { useTranslation } from 'react-i18next';
import useIdioma from '../hooks/useIdioma';
import estilos from './Experiencias.module.css';
import ExpPt from '../conteudo/experiencias/pt.mdx';
import ExpEn from '../conteudo/experiencias/en.mdx';
import useTitulo from '../hooks/useTitulo';

export default function Experiencias() {
  const { t } = useTranslation();
  useTitulo(t('menu.experiencias'));
  const idioma = useIdioma();
  const Corpo = idioma === 'en' ? ExpEn : ExpPt;

  return (
    <>
      <header className={estilos.cabecalho}>
        <h1>{t('experiencias.titulo')}</h1>
        <p className="metadado">{t('experiencias.subtitulo')}</p>
      </header>

      <div className={estilos.corpo}>
        <Corpo />
      </div>
    </>
  );
}
