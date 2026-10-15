import estilos from './Experiencia.module.css';

export default function Experiencia({ periodo, instituicao, cargo, contexto, children }) {
  return (
    <section className={estilos.experiencia}>
      <p className={estilos.periodo}>{periodo}</p>
      <div className={estilos.detalhes}>
        <header className={estilos.cabecalho}>
          <h2>{instituicao}</h2>
          <p className={estilos.cargo}>{cargo}</p>
          {contexto && <p className={estilos.contexto}>{contexto}</p>}
        </header>
        <div className={estilos.conteudo}>{children}</div>
      </div>
    </section>
  );
}
