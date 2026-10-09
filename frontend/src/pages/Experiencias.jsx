import { useTranslation } from 'react-i18next';
import useIdioma from '../hooks/useIdioma';
import SecaoVazia from '../components/SecaoVazia';
import estilos from './Experiencias.module.css';
import ExpPt from '../conteudo/experiencias/pt.mdx';
import ExpEn from '../conteudo/experiencias/en.mdx';

export default function Experiencias() {
  const { t } = useTranslation();
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

      <aside className={estilos.veiculo}>
        <SecaoVazia altura={250}>
          imagem oficial do veículo (card com link para o site da RAM)
        </SecaoVazia>
        <p className="metadado">
          Programa em que mais atuei. Imagem linkada ao site oficial, não hospedada.
        </p>
      </aside>
    </>
  );
}
