import { useTranslation } from 'react-i18next';
import estilos from './Footer.module.css';
import { LINKS } from '../config/links';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={estilos.rodape}>
      <div className={estilos.conteudo}>
        <span className="metadado">{t('rodape.direitos', { ano: new Date().getFullYear() })}</span>
        <nav className={estilos.links} aria-label="Links sociais">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <span aria-hidden="true">·</span>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${LINKS.email}`}>E-mail</a>
        </nav>
      </div>
    </footer>
  );
}
