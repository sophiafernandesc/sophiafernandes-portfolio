import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CHAVE = 'tema';
const ESCURO = 'escuro';
const CLARO = 'claro';

const TemaContexto = createContext(null);

/* Lê a preferência já salva; na primeira visita, pergunta ao sistema
   operacional. O localStorage pode lançar (modo privado, cookies bloqueados),
   então toda leitura e escrita vai protegida: o site não pode deixar de
   renderizar porque o navegador recusou guardar uma string. */
function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === CLARO || salvo === ESCURO) return salvo;
  } catch {
    /* sem acesso ao storage: segue para a preferência do sistema */
  }

  const prefereClaro =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches;

  return prefereClaro ? CLARO : ESCURO;
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  /* O tokens.css pendura o tema claro em :root[data-tema='claro'], então o
     atributo precisa estar no <html>. No escuro ele é removido, e aí vale o
     :root padrão, e assim o tema escuro continua funcionando mesmo se o
     JavaScript falhar. */
  useEffect(() => {
    const raiz = document.documentElement;
    if (tema === CLARO) raiz.setAttribute('data-tema', CLARO);
    else raiz.removeAttribute('data-tema');

    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      /* preferência vale só nesta sessão */
    }
  }, [tema]);

  /* Acompanha a troca no sistema operacional, mas só para quem ainda não
     escolheu à mão: escolha explícita do usuário sempre ganha. */
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: light)');
    if (!mq) return undefined;

    const aoTrocar = (e) => {
      let escolheu = false;
      try {
        escolheu = localStorage.getItem(CHAVE) !== null;
      } catch {
        /* sem storage: trata como quem não escolheu */
      }
      if (!escolheu) setTema(e.matches ? CLARO : ESCURO);
    };

    mq.addEventListener('change', aoTrocar);
    return () => mq.removeEventListener('change', aoTrocar);
  }, []);

  const alternar = useCallback(
    () => setTema((atual) => (atual === CLARO ? ESCURO : CLARO)),
    []
  );

  return (
    <TemaContexto.Provider value={{ tema, alternar, claro: tema === CLARO }}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContexto);
  if (!ctx) throw new Error('useTema precisa estar dentro de <TemaProvider>.');
  return ctx;
}
