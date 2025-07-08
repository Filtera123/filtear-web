import { ChakraUIProvider } from './ChakraUIProvider';
import Router from './router';

import './styles/globals.css';

import RootQueryProvider from '@/RootQuery.provider.tsx';

function App() {
  return (
    <RootQueryProvider>
      <ChakraUIProvider>
        <Router />
      </ChakraUIProvider>
    </RootQueryProvider>
  );
}

export default App;
