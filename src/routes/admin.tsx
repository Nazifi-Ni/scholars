import { Outlet, createFileRoute, redirect, useLocation, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Tags, Mail } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    // We check auth inside the component to use hooks, but Tanstack router normally uses context for auth.
    // For simplicity, we'll let the component redirect if not logged in.
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  if (!user && !isLoginPage) {
    // Redirect to login if not authenticated
    return (
      <div className="p-10 text-center">
        <p>You must be logged in to view this page.</p>
        <Link to="/admin/login">
          <Button className="mt-4">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // If it's the login page, don't show the dashboard layout
  if (isLoginPage) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <nav className="mt-6 space-y-1 px-4">
          <Link to="/admin" className="flex items-center space-x-2 rounded-md px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/opportunities" className="flex items-center space-x-2 rounded-md px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600">
            <FileText size={20} /> <span>Opportunities</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center space-x-2 rounded-md px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600">
            <Tags size={20} /> <span>Categories</span>
          </Link>
          <Link to="/admin/blogs" className="flex items-center space-x-2 rounded-md px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600">
            <FileText size={20} /> <span>Blog Posts</span>
          </Link>
          <Link to="/admin/subscribers" className="flex items-center space-x-2 rounded-md px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600">
            <Mail size={20} /> <span>Subscribers</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}
