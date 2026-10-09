import { useTranslation } from 'react-i18next';
import Neofetch from '../components/Neofetch';
import useIdioma from '../hooks/useIdioma';
import estilos from './Sobre.module.css';
import SobrePt from '../conteudo/sobre/pt.mdx';
import SobreEn from '../conteudo/sobre/en.mdx';

export default function Sobre() {
  const { t } = useTranslation();
  const idioma = useIdioma();
  const Corpo = idioma === 'en' ? SobreEn : SobrePt;

  return (
    <>
      <header className={estilos.cabecalho}>
        <h1>{t('sobre.titulo')}</h1>
        <p className="metadado">{t('sobre.subtitulo')}</p>
      </header>

      <Neofetch />

      <div className={estilos.corpo}>
        <Corpo />
      </div>
    </>
  );
}
