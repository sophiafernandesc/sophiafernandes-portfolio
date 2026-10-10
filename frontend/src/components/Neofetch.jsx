import { useTranslation } from 'react-i18next';
import estilos from './Neofetch.module.css';

export default function Neofetch() {
  const { t } = useTranslation();
  const dados = t('neofetch.campos', { returnObjects: true });

  return (
    <section className={estilos.cartao} aria-label="Resumo">
      <p className={estilos.usuario}>sophia@portfolio</p>
      <dl className={estilos.dados}>
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
