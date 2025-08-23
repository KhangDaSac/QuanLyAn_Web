import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <span className="font-bold text-lg">My App</span>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          {/* Add more navigation links here if needed */}
        </nav>
      </header>
      <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
      <footer className="bg-blue-600 text-white p-2 text-center text-sm">
        &copy; {new Date().getFullYear()} My App
      </footer>
    </div>
  );
}
