import Router from './router';

import './styles/globals.css';

import RootQueryProvider from '@/RootQuery.provider.tsx';

function App() {
  return (
    <RootQueryProvider>
      <Router />
    </RootQueryProvider>
  );
}

export default App;
