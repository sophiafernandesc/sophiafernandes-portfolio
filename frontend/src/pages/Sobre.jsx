import { useTranslation } from 'react-i18next';
import Neofetch from '../components/Neofetch';
import FiguraEsp32 from '../components/FiguraEsp32';
import useIdioma from '../hooks/useIdioma';
import estilos from './Sobre.module.css';
import SobrePt from '../conteudo/sobre/pt.mdx';
import SobreEn from '../conteudo/sobre/en.mdx';
import ApresentacaoPt from '../conteudo/sobre/apresentacao-pt.mdx';
import ApresentacaoEn from '../conteudo/sobre/apresentacao-en.mdx';

export default function Sobre() {
  const { t } = useTranslation();
  const idioma = useIdioma();
  const Corpo = idioma === 'en' ? SobreEn : SobrePt;
  const Apresentacao = idioma === 'en' ? ApresentacaoEn : ApresentacaoPt;

  return (
    <>
      <header className={estilos.cabecalho}><h1>{t('sobre.titulo')}</h1></header>
      <div className={estilos.apresentacao}>
        <div className={estilos.trajetoria}>
          <h2 className={estilos.chamada}>{t('sobre.chamada')}</h2>
          <Apresentacao />
          <Neofetch />
        </div>
        <FiguraEsp32 />
      </div>
      <div className={estilos.corpo}><Corpo /></div>
    </>
  );
}
