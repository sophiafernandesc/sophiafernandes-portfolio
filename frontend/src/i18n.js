import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptComum from './locales/pt/comum.json';
import enComum from './locales/en/comum.json';

// Só STRINGS DE INTERFACE vivem aqui: menu, rótulos, botões, mensagens.
// Conteúdo longo (descrição de projeto, Sobre mim) fica em arquivos .mdx,
// em src/conteudo/<tipo>/<idioma>/. Parágrafo dentro de arquivo de tradução
// é o caminho mais curto para um i18n.js de milhares de linhas.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { comum: ptComum },
      en: { comum: enComum },
    },
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    defaultNS: 'comum',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'idioma',
    },
  });

// Mantém o atributo lang do documento em dia: leitores de tela usam isso
// para escolher a pronúncia correta.
const aplicarLang = (lng) => {
  document.documentElement.lang = lng === 'en' ? 'en' : 'pt-BR';
};
aplicarLang(i18n.resolvedLanguage);
i18n.on('languageChanged', aplicarLang);

export default i18n;
