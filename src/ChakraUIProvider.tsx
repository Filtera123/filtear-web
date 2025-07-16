import type { ReactNode } from 'react';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  preflight: false,
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});

export const ChakraUIProvider = ({ children }: { children: ReactNode }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
