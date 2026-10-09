import { useTranslation } from 'react-i18next';
import estilos from './Cracha.module.css';

/* Crachá com a foto da autora. Na Sprint 03 ele vira a peça 3D pendurada no
   cordão, com física; esta versão estática continua existindo depois disso,
   como fallback em celular e sob prefers-reduced-motion.
   A foto é um recorte com alfa, então o fundo do cartão aparece atrás dela. */
export default function Cracha() {
  const { t } = useTranslation();

  return (
    <figure className={estilos.figura}>
      <div className={`${estilos.cartao} grade`}>
        <span className={estilos.furo} aria-hidden="true" />
        <img
          className={estilos.foto}
          src="/img/foto-cracha.webp"
          alt={t('home.foto_alt')}
          width="447"
          height="559"
        />
        <div className={estilos.identificacao}>
          <span className={estilos.nome}>Sophia Fernandes</span>
          <span className={estilos.papel}>{t('home.papel')}</span>
        </div>
      </div>
      <figcaption className="metadado">{t('home.cracha_legenda')}</figcaption>
    </figure>
  );
}
