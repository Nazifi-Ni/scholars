import { Outlet, createFileRoute, useLocation, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Tags,
  Mail,
  Menu,
  ShieldCheck,
  ExternalLink,
  Users,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Editorial & Content",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/opportunities", label: "Opportunities", icon: GraduationCap },
      { to: "/admin/blogs", label: "Blog Posts", icon: FileText },
    ],
  },
  {
    title: "Taxonomy & Audience",
    items: [
      { to: "/admin/categories", label: "Categories", icon: Tags },
      { to: "/admin/users", label: "Users & Roles", icon: Users },
      { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
    ],
  },
  {
    title: "System & Config",
    items: [{ to: "/admin/settings", label: "Global Settings", icon: SlidersHorizontal }],
  },
];

function SidebarContent({
  user,
  handleLogout,
  onNavigate,
  pathname,
}: {
  user: any;
  handleLogout: () => void;
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <div className="flex flex-col h-full bg-[#0a1128] text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link
          to="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 group transition-opacity hover:opacity-90"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <ShieldCheck size={22} />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Scholars<span className="text-emerald-400">Admin</span>
            </div>
            <p className="text-[11px] text-white/50 font-sans">Editorial Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white"
                      }
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink size={15} className="text-white/50" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] text-white/40">Open ↗</span>
        </a>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/70 hover:text-red-300 hover:bg-red-500/20 h-10 rounded-xl transition-colors text-xs font-semibold"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2.5 text-red-400" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = location.pathname === "/admin/login";

  if (isLoading) {
    return (
      <div className="p-10 text-center flex items-center justify-center h-screen bg-[#0a1128]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">
            You need administrator privileges to access this dashboard.
          </p>
          <Link to="/admin/login">
            <Button className="w-full h-12 text-md font-semibold bg-[#0a1128] hover:bg-[#142148] text-white">
              Go to Secure Login
            </Button>
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
    window.location.href = "/admin/login";
  };

  // Breadcrumbs title helper
  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Editorial Overview";
    if (path.startsWith("/admin/opportunities")) return "Opportunities Management";
    if (path.startsWith("/admin/blogs")) return "Blog Posts & Guides";
    if (path.startsWith("/admin/categories")) return "Taxonomy Categories";
    if (path.startsWith("/admin/users")) return "User & Role Management";
    if (path.startsWith("/admin/subscribers")) return "Newsletter Subscribers";
    if (path.startsWith("/admin/settings")) return "Global Settings";
    return "Admin Hub";
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[#0a1128] text-white flex-col shadow-2xl z-20 hidden lg:flex border-r border-white/5 relative">
        <SidebarContent user={user} handleLogout={handleLogout} pathname={location.pathname} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-[#0a1128] border-r-0 text-white flex flex-col"
              >
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <SidebarContent
                  user={user}
                  handleLogout={handleLogout}
                  onNavigate={() => setMobileOpen(false)}
                  pathname={location.pathname}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb / Page Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Admin /</span>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 font-heading">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          </div>

          {/* Right side Profile & Quick Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </a>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user?.name || "Administrator"}
              </p>
              <p className="text-xs text-gray-500 leading-tight">{user?.email}</p>
            </div>

            <Avatar className="h-9 w-9 border-2 border-emerald-500/20">
              <AvatarFallback className="bg-[#0a1128] text-emerald-400 font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || "A"}
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
