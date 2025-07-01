import Layout from '@components/layout/Layout';
import Home from '@pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Loading = () => <div className="flex items-center justify-center">Loading...</div>;

// 使用React官方懒加载
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { 
        path: 'about', 
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ) 
      },
    ],
  },
  { 
    path: '*', 
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ) 
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
