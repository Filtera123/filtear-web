import type { ReactNode } from 'react';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  preflight: false,
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Source Han Sans CN', 'Source Han Sans', sans-serif` },
        body: { value: `'Source Han Sans CN', 'Source Han Sans', sans-serif` },
      },
    },
  },
});

export const ChakraUIProvider = ({ children }: { children: ReactNode }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
