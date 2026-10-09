import { useTranslation } from 'react-i18next';
import Neofetch from '../components/Neofetch';
import SecaoVazia from '../components/SecaoVazia';
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

      {/* Neofetch e modelo 3D lado a lado: o cartão de dados à esquerda, a
          peça que deu origem à trajetória à direita. Empilha no celular. */}
      <div className={estilos.apresentacao}>
        <Neofetch />

        <figure className={estilos.figura}>
          <SecaoVazia altura={280}>{t('sobre.esp32_reservado')}</SecaoVazia>
          <figcaption className="metadado">
            {t('sobre.esp32_legenda')} {t('sobre.esp32_credito')}
          </figcaption>
        </figure>
      </div>

      <div className={estilos.corpo}>
        <Corpo />
      </div>
    </>
  );
}
