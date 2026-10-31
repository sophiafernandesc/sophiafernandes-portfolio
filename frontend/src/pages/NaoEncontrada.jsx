import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useTitulo from '../hooks/useTitulo';

export default function NaoEncontrada() {
  const { t } = useTranslation();
  useTitulo(t('erro.nao_encontrado'));
  return (
    <>
      <h1>404</h1>
      <p>{t('erro.nao_encontrado')}</p>
      <Link to="/">← {t('erro.voltar')}</Link>
    </>
  );
}
