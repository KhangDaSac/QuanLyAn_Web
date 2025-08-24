import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

export default function Layout() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </MainLayout>
  );
}