import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NaoEncontrada() {
  const { t } = useTranslation();
  return (
    <>
      <h1>404</h1>
      <p>{t('erro.nao_encontrado')}</p>
      <Link to="/">← {t('erro.voltar')}</Link>
    </>
  );
}
