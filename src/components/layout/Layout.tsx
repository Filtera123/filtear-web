import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container relative py-6 lg:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
