import loadable from '@loadable/component';
import Home from '@pages/home/index';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FloatBasedLayout from '@/components/layout/float-based/Layout';

const Loading = () => <div className="flex items-center justify-center">Loading...</div>;

const ArticleEditor = loadable(() => import('./pages/article-editor'), {
  fallback: <Loading />,
});
const About = loadable(() => import('./pages/About'), {
  fallback: <Loading />,
});
const NotFound = loadable(() => import('./pages/NotFound'), {
  fallback: <Loading />,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <FloatBasedLayout />,
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
    path: '/editor/:user/normal/:id?',
    element: <ArticleEditor />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
