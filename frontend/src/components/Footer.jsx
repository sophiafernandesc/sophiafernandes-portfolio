import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import estilos from './Footer.module.css';
import { LINKS } from '../config/links';

export default function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
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
      {pathname === '/sobre' && (
        <p className={`${estilos.creditos} metadado`}>
          {t('rodape.modelo_esp32')}{' '}
          <a href="https://sketchfab.com/3d-models/esp32-78c2b5a932a1463bbc6e8ada630a0545" target="_blank" rel="noopener noreferrer">Davyd Tovstyj</a>
          {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          {' · '}{t('rodape.esp32_derivada')}
        </p>
      )}
    </footer>
  );
}
