import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { useTema } from '../theme/TemaProvider';
import estilos from './Nav.module.css';

const ROTAS = [
  { para: '/', chave: 'menu.home', fim: true },
  { para: '/sobre', chave: 'menu.sobre' },
  { para: '/projetos', chave: 'menu.projetos' },
  { para: '/experiencias', chave: 'menu.experiencias' },
  { para: '/curriculo', chave: 'menu.curriculo' },
  { para: '/contato', chave: 'menu.contato' },
];

export default function Nav() {
  const { t, i18n } = useTranslation();
  const { alternar, claro } = useTema();
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();

  // Fecha o menu ao trocar de rota, senão ele fica aberto por cima da página
  useEffect(() => setAberto(false), [pathname]);

  const idioma = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt';
  const trocar = (lng) => i18n.changeLanguage(lng);

  return (
    <header className={estilos.cabecalho}>
      <nav className={estilos.nav} aria-label={t('menu.abrir')}>
        <button
          type="button"
          className={estilos.hamburguer}
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? t('menu.fechar') : t('menu.abrir')}
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <ul
          id="menu-principal"
          className={`${estilos.itens} ${aberto ? estilos.itensAbertos : ''}`}
        >
          {ROTAS.map(({ para, chave, fim }) => (
            <li key={para}>
              <NavLink
                to={para}
                end={fim}
                className={({ isActive }) =>
                  `${estilos.item} ${isActive ? estilos.ativo : ''}`
                }
              >
                {t(chave)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={estilos.controles}>
          <button
            type="button"
            className={estilos.tema}
            onClick={alternar}
            aria-label={claro ? t('menu.tema_escuro') : t('menu.tema_claro')}
            aria-pressed={claro}
          >
            {claro ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
          </button>

          <div className={estilos.idioma} role="group" aria-label={t('menu.idioma')}>
            <FiGlobe className={estilos.globo} aria-hidden="true" />
            <button
              type="button"
              onClick={() => trocar('pt')}
              className={`${estilos.lng} ${idioma === 'pt' ? estilos.lngAtivo : ''}`}
              aria-pressed={idioma === 'pt'}
              lang="pt-BR"
            >
              PT
            </button>
            <span aria-hidden="true" className={estilos.divisor}>
              |
            </span>
            <button
              type="button"
              onClick={() => trocar('en')}
              className={`${estilos.lng} ${idioma === 'en' ? estilos.lngAtivo : ''}`}
              aria-pressed={idioma === 'en'}
              lang="en"
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
