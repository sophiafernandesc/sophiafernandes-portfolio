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

  const primeiraRota = useRef(true);

  // Em navegação por rota o scroll não volta sozinho, e o leitor de tela
  // continua onde estava: subimos a página e movemos o foco para o conteúdo.
  //
  // Na PRIMEIRA carga não: o efeito dispara na montagem também, e mover o foco
  // ali joga quem navega por teclado para dentro do conteúdo, deixando para
  // trás o link "pular para o conteúdo", o menu, o tema e o idioma.
  useEffect(() => {
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    window.scrollTo(0, 0);
    // preventScroll: sem ele o navegador rola o <main> para dentro da viewport
    // e, como o cabeçalho é sticky, para logo abaixo dele, desfazendo o
    // scrollTo acima e deixando o título coberto pelo menu.
    principal.current?.focus({ preventScroll: true });
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
