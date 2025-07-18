import { ChakraUIProvider } from './ChakraUIProvider';
import Router from './router';

import './styles/globals.css';

import RootQueryProvider from '@/RootQuery.provider.tsx';
import { ReportProvider } from './components/report';

function App() {
  return (
    <RootQueryProvider>
      <ChakraUIProvider>
        <ReportProvider>
        <Router />
        </ReportProvider>
      </ChakraUIProvider>
    </RootQueryProvider>
  );
}

export default App;
