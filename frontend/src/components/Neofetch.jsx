import { useTranslation } from 'react-i18next';
import estilos from './Neofetch.module.css';

// Cartão no formato do comando neofetch: arte em ASCII à esquerda, pares de
// chave e valor à direita. O alinhamento NÃO é feito com espaços no texto,
// e sim com grid: senão quebra assim que "Formação" vira "Education" no inglês.
const ARTE = `   ______
  |,----.|
  ||ESP ||
  ||32  ||
  |\`----'|
  '-[::]-'`;

export default function Neofetch() {
  const { t } = useTranslation();
  const dados = t('neofetch.campos', { returnObjects: true });

  return (
    <section className={estilos.cartao} aria-label="Resumo">
      <pre className={estilos.arte} aria-hidden="true">{ARTE}</pre>
      <dl className={estilos.dados}>
        <p className={estilos.usuario}>sophia@portfolio</p>
        {Array.isArray(dados) &&
          dados.map(({ chave, valor }) => (
            <div key={chave} className={estilos.linha}>
              <dt className={estilos.chave}>{chave}</dt>
              <dd className={estilos.valor}>{valor}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}
