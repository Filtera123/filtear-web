import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const rootQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 10 * 60 * 1000, // 10分钟
      refetchOnWindowFocus: false,
    },
  },
});

const RootQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={rootQueryClient}>{children}</QueryClientProvider>;
};

export default RootQueryProvider;
