import { useTranslation } from 'react-i18next';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import useIdioma from '../hooks/useIdioma';
import { LINKS } from '../config/links';
import CurriculoPt from '../conteudo/curriculo/pt.mdx';
import CurriculoEn from '../conteudo/curriculo/en.mdx';
import estilos from './Curriculo.module.css';

export default function Curriculo() {
  const { t } = useTranslation();
  const idioma = useIdioma();
  const Corpo = idioma === 'en' ? CurriculoEn : CurriculoPt;
  const pdf = idioma === 'en' ? LINKS.curriculoEn : LINKS.curriculo;

  return (
    <>
      <header className={estilos.cabecalho}>
        <div><h1>{t('menu.curriculo')}</h1><p>{t('curriculo.subtitulo')}</p></div>
        <div className={estilos.acoes}>
              <a className={estilos.download} href={pdf} download><FiDownload aria-hidden="true" />{t('curriculo.baixar')}</a>
              <a className={estilos.abrir} href={pdf} target="_blank" rel="noopener noreferrer"><FiExternalLink aria-hidden="true" />{t('curriculo.abrir')}</a>
        </div>
      </header>
      <article className={estilos.documento}>
        <h2 className={estilos.nome}>Sophia da Costa Fernandes</h2>
        <p className={estilos.papel}>{t('home.papel')} · {t('home.local')}</p>
        <nav className={estilos.contatos} aria-label={t('curriculo.contatos')}>
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
        <Corpo />
      </article>
    </>
  );
}
