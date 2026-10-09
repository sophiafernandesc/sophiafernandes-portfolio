import estilos from './SecaoVazia.module.css';

// Espaço reservado das partes que ainda não existem (modelo 3D, gráfico do
// Wakatime, foto). Mantém o layout de pé na Sprint 01 sem fingir que está
// pronto: o rótulo diz o que vai entrar ali.
export default function SecaoVazia({ children, altura = 200 }) {
  return (
    <div className={`${estilos.caixa} grade`} style={{ minHeight: altura }}>
      <span className="metadado">{children}</span>
    </div>
  );
}
