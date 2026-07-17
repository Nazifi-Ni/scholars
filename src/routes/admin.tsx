import { Outlet, createFileRoute, redirect, useLocation, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Tags, Mail, Globe } from 'lucide-react';

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
    <div className="flex h-screen bg-muted/30 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col shadow-xl z-20 hidden md:flex">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <LayoutDashboard size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight font-heading">Admin Hub</h2>
            <p className="text-xs text-white/60">{user?.email}</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Core Data</div>
          
          <Link to="/admin" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <LayoutDashboard size={18} /> <span className="text-sm">Overview</span>
          </Link>
          <Link to="/admin/opportunities" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <FileText size={18} /> <span className="text-sm">Opportunities</span>
          </Link>
          <Link to="/admin/blogs" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <FileText size={18} /> <span className="text-sm">Blog Posts</span>
          </Link>

          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 mt-6 px-2">Configuration</div>

          <Link to="/admin/categories" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <Tags size={18} /> <span className="text-sm">Categories</span>
          </Link>
          <Link to="/admin/countries" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <Globe size={18} /> <span className="text-sm">Countries</span>
          </Link>

          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 mt-6 px-2">Community</div>

          <Link to="/admin/subscribers" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-secondary [&.active]:text-white [&.active]:font-semibold">
            <Mail size={18} /> <span className="text-sm">Subscribers</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 h-12 rounded-xl" onClick={handleLogout}>
            <LogOut size={18} className="mr-3" /> <span className="text-sm font-semibold">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-navy text-white p-4 flex justify-between items-center shadow-md">
          <h2 className="text-lg font-bold font-heading">Admin Hub</h2>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut size={20} />
          </Button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
