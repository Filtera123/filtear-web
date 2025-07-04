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
const UserProfile = loadable(() => import('./pages/UserProfile'), {
  fallback: <Loading />,
});
const PostDetail = loadable(() => import('./pages/PostDetail'), {
  fallback: <Loading />,
});
const TagPage = loadable(() => import('./pages/TagPage'), {
  fallback: <Loading />,
});
const NotFound = loadable(() => import('./pages/NotFound'), {
  fallback: <Loading />,
});
const PostCardsDemo = loadable(() => import('./pages/PostCardsDemo'), {
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
      {
        path: 'demo/post-cards',
        element: <PostCardsDemo />,
      },
    ],
  },
  {
    path: '/editor/:user/normal',
    element: <ArticleEditor />,
  },
  {
    path: '/user/:userId',
    element: <UserProfile />,
  },
  {
    path: '/post/:postId',
    element: <PostDetail />,
  },
  {
    path: '/tag/:tag',
    element: <TagPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
