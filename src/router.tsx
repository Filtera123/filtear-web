import loadable from '@loadable/component';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FloatBasedLayout from './components/layout/float-based/Layout';
import TagPageLayout from './components/layout/TagPageLayout';
import Home from './pages/home/index';

const Loading = () => <div className="flex items-center justify-center">Loading...</div>;

const ArticleEditor = loadable(() => import('./pages/article-editor'), {
  fallback: <Loading />,
});

const About = loadable(() => import('./pages/About'), {
  fallback: <Loading />,
});

const PostCardsDemo = loadable(() => import('./pages/PostCardsDemo'), {
  fallback: <Loading />,
});

const Notifications = loadable(() => import('./pages/Notifications'), {
  fallback: <Loading />,
});

const TagManagement = loadable(() => import('./pages/TagManagement'), {
  fallback: <Loading />,
});

const ArticleDetail = loadable(() => import('./pages/post-details/ArticleDetail'), {
  fallback: <Loading />,
});

const VideoDetail = loadable(() => import('./pages/post-details/VideoDetail'), {
  fallback: <Loading />,
});

const ImageDetail = loadable(() => import('./pages/post-details/ImageDetail'), {
  fallback: <Loading />,
});

const DynamicDetail = loadable(() => import('./pages/post-details/DynamicDetail'), {
  fallback: <Loading />,
});

const UserProfile = loadable(() => import('./pages/UserProfile'), {
  fallback: <Loading />,
});

const FollowListPage = loadable(() => import('./pages/FollowListPage'), {
  fallback: <Loading />,
});

const RecentlyViewed = loadable(() => import('./pages/RecentlyViewed'), {
  fallback: <Loading />,
});

const TagPage = loadable(() => import('./pages/TagPage'), {
  fallback: <Loading />,
});

const Login = loadable(
  () => import('./modules/login').then((module) => ({ default: module.Login })),
  {
    fallback: <Loading />,
  }
);

const NotFound = loadable(() => import('./pages/NotFound'), {
  fallback: <Loading />,
});

const Settings = loadable(() => import('./pages/Settings'), {
  fallback: <Loading />,
});

const CreatorCenter = loadable(() => import('./pages/CreatorCenter'), {
  fallback: <Loading />,
});

// Import SearchResults from pages directory
const SearchResults = loadable(() => import('./pages/SearchResults'), {
  fallback: <Loading />,
});

// 配置路由
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
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'tag-management',
        element: <TagManagement />,
      },
      {
        path: 'search-results/:query', // 新增路由，处理搜索结果页面
        element: <SearchResults />, // 路由跳转到 SearchResults
      },
      {
        path: 'user/:userId',
        element: <UserProfile />,
      },
      {
        path: 'user/:userId/followers',
        element: <FollowListPage />,
      },
      {
        path: 'user/:userId/following',
        element: <FollowListPage />,
      },
      {
        path: 'recently-viewed',
        element: <RecentlyViewed />,
      },
    ],
  },
  {
    path: '/editor/:user/normal/:id',
    element: <ArticleEditor />,
  },
  {
    path: '/post/article/:postId',
    element: <ArticleDetail />,
  },
  {
    path: '/post/video/:postId',
    element: <VideoDetail />,
  },
  {
    path: '/post/image/:postId',
    element: <ImageDetail />,
  },
  {
    path: '/post/dynamic/:postId',
    element: <DynamicDetail />,
  },
  {
    path: '/tag/:tag',
    element: <TagPageLayout />,
    children: [
      {
        index: true,
        element: <TagPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/creator-center',
    element: <CreatorCenter />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
