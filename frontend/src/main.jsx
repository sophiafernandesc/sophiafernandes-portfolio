import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MDXProvider } from '@mdx-js/react';
import App from './App';
import { TemaProvider } from './theme/TemaProvider';
import { componentesMdx } from './styles/mdxComponents';
import './i18n';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <MDXProvider components={componentesMdx}>
        <App />
      </MDXProvider>
    </TemaProvider>
  </StrictMode>
);
