import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Projetos from './pages/Projetos';
import ProjetoDetalhe from './pages/ProjetoDetalhe';
import Experiencias from './pages/Experiencias';
import Contato from './pages/Contato';
import Curriculo from './pages/Curriculo';
import NaoEncontrada from './pages/NaoEncontrada';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'projetos', element: <Projetos /> },
      { path: 'projetos/:slug', element: <ProjetoDetalhe /> },
      { path: 'experiencias', element: <Experiencias /> },
      { path: 'curriculo', element: <Curriculo /> },
      { path: 'contato', element: <Contato /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
