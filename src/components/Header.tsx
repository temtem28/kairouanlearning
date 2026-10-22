import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, Shield } from 'lucide-react';
import KairouanLogo from '@/components/KairouanLogo';

const Header: React.FC = () => {
  const { user, logout, isCollaborator } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <KairouanLogo size={34} variant="gold" showText={true} className="hidden sm:flex" />
            <KairouanLogo size={30} variant="gold" showText={false} className="sm:hidden" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {[
              { to: '/', label: 'Accueil' },
              { to: '/catalogue', label: 'Catalogue' },
              { to: '/contact', label: 'Contact' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => navigate('/panier')}
              className="relative p-2 text-white/60 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-400 text-black text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
                    <span className="text-gold-300 font-semibold text-xs">{user.name[0]?.toUpperCase()}</span>
                  </div>
                  <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-52 bg-black border border-white/15 shadow-2xl py-1 z-50">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Espace étudiant
                      </Link>
                      {isCollaborator && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                          Administration
                        </Link>
                      )}
                      <div className="my-1 border-t border-white/10" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/connexion"
                  className="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Collaborateur
                </Link>
                <Link
                  to="/connexion"
                  className="flex items-center gap-1.5 px-5 py-2 bg-gold-400 hover:bg-gold-300 text-black text-sm font-bold transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Connexion
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-black border-t border-white/10">
          <div className="px-4 py-3 space-y-0.5">
            {[
              { to: '/', label: 'Accueil' },
              { to: '/catalogue', label: 'Catalogue' },
              { to: '/contact', label: 'Contact' },
            ].map(item => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 border border-gold-400/30 text-gold-300 font-medium text-center">
                  Mon espace
                </Link>
              ) : (
                <Link to="/connexion" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 bg-gold-400 text-black font-bold text-center">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
