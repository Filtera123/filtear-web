import Layout from '@components/layout/Layout';
import loadable from '@loadable/component';
import Home from '@pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Loading = () => <div className="flex items-center justify-center">Loading...</div>;

const About = loadable(() => import('./pages/About'), {
  fallback: <Loading />,
});
const NotFound = loadable(() => import('./pages/NotFound'), {
  fallback: <Loading />,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
