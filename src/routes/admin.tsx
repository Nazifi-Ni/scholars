import { Outlet, createFileRoute, useLocation, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, LogOut, Tags, Mail, Globe, Menu, ShieldCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function SidebarContent({ user, handleLogout }: { user: any, handleLogout: () => void }) {
  return (
    <>
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight font-heading text-white">Admin Hub</h2>
          <p className="text-xs text-white/60 truncate w-40">{user?.email}</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Core Data</div>
        
        <Link to="/admin" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <LayoutDashboard size={18} /> <span className="text-sm">Overview</span>
        </Link>
        <Link to="/admin/opportunities" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <FileText size={18} /> <span className="text-sm">Opportunities</span>
        </Link>
        <Link to="/admin/blogs" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <FileText size={18} /> <span className="text-sm">Blog Posts</span>
        </Link>

        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 mt-8 px-2">Configuration</div>

        <Link to="/admin/categories" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <Tags size={18} /> <span className="text-sm">Categories</span>
        </Link>
        <Link to="/admin/countries" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <Globe size={18} /> <span className="text-sm">Countries</span>
        </Link>

        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 mt-8 px-2">Community</div>

        <Link to="/admin/subscribers" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 [&.active]:bg-gradient-to-r [&.active]:from-indigo-500/20 [&.active]:to-purple-600/20 [&.active]:text-white [&.active]:font-semibold [&.active]:border-l-2 [&.active]:border-indigo-400">
          <Mail size={18} /> <span className="text-sm">Subscribers</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-red-500/20 h-12 rounded-xl transition-colors" onClick={handleLogout}>
          <LogOut size={18} className="mr-3" /> <span className="text-sm font-semibold">Sign Out</span>
        </Button>
      </div>
    </>
  );
}

function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  if (isLoading) return <div className="p-10 text-center flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  if (!user && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">You need administrator privileges to access this dashboard.</p>
          <Link to="/admin/login">
            <Button className="w-full h-12 text-md font-semibold bg-indigo-600 hover:bg-indigo-700">Go to Secure Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-col shadow-2xl z-20 hidden lg:flex border-r border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 pointer-events-none" />
        <SidebarContent user={user} handleLogout={handleLogout} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-600">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-slate-900 border-r-0 text-white flex flex-col">
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <SidebarContent user={user} handleLogout={handleLogout} />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold text-gray-800 lg:hidden">Admin Hub</h1>
          </div>

          {/* Right side Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-indigo-100">
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
