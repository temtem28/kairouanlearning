import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, BookOpen, Users, ShoppingBag, Tag, LogOut,
  Menu, X, ChevronRight, ExternalLink, UserCircle, Shield
} from 'lucide-react';
import KairouanLogo from '@/components/KairouanLogo';

const adminNavItems = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard, end: true },
  { to: '/admin/cours', label: 'Cours', icon: BookOpen },
  { to: '/admin/etudiants', label: 'Étudiants', icon: Users },
  { to: '/admin/comptes', label: 'Comptes', icon: Shield },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
];

const collaboratorNavItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/cours', label: 'Mes cours', icon: BookOpen },
  { to: '/admin/profil', label: 'Mon profil', icon: UserCircle },
];

const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = isAdmin ? adminNavItems : collaboratorNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gold-400/15">
        <KairouanLogo size={32} variant="gold" showText={true} />
        <p className="text-gold-100/30 text-xs mt-3 truncate">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-400/15 text-gold-300 border border-gold-400/30'
                  : 'text-gold-100/50 hover:bg-forest-800 hover:text-gold-200'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-gold-400/15 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gold-100/50 hover:bg-forest-800 hover:text-gold-200 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gold-100/50 hover:bg-red-950/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-forest-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-forest-900 border-r border-gold-400/10 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-forest-950/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-forest-900 border-r border-gold-400/10 flex flex-col lg:hidden transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gold-400/50 hover:text-gold-300"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-forest-900 border-b border-gold-400/10 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gold-400/60 hover:bg-forest-800 hover:text-gold-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-gold-100/40 min-w-0">
            <span className="text-gold-200 font-medium">Admin</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Tableau de bord</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-400/15 border border-gold-400/35 rounded-full flex items-center justify-center text-sm font-bold text-gold-300 font-display">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gold-200/80">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
