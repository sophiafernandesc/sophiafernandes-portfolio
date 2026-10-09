import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Nav from './Nav';
import Footer from './Footer';
import estilos from './Layout.module.css';

export default function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const principal = useRef(null);

  // Em navegação por rota o scroll não volta sozinho, e o leitor de tela
  // continua onde estava: subimos a página e movemos o foco para o conteúdo.
  useEffect(() => {
    window.scrollTo(0, 0);
    principal.current?.focus();
  }, [pathname]);

  return (
    <>
      <a className="pular-para-conteudo" href="#conteudo">{t('menu.pular')}</a>
      <Nav />
      <main id="conteudo" ref={principal} tabIndex={-1} className={estilos.principal}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
