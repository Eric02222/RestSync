import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/context';
import {
  HeartPulse,
  LayoutDashboard,
  Users,
  History,
  LogOut,
  Menu,
  X,
  User,
  UserCog,
  BellRing,
  ScrollText,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'medico', 'familiar'],
    },
    {
      to: '/pacientes',
      label: 'Residentes',
      icon: Users,
      roles: ['admin', 'medico', 'familiar'],
    },
    {
      to: '/historico',
      label: 'Histórico',
      icon: History,
      roles: ['admin', 'medico', 'familiar'],
    },
    {
      to: '/alertas',
      label: 'Alertas',
      icon: BellRing,
      roles: ['admin', 'medico', 'familiar'],
    },
    {
      to: '/usuarios',
      label: 'Usuários',
      icon: UserCog,
      roles: ['admin'],
    },
    {
      to: '/logs',
      label: 'Auditoria',
      icon: ScrollText,
      roles: ['admin'],
    },
  ];

  // Filter items by user role
  const allowedNavItems = navItems.filter(item =>
    !item.roles || item.roles.includes(user?.tipo_usuario)
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <div className="flex flex-shrink-0 items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <span className="ml-3 font-sans text-xl font-bold tracking-tight text-slate-900">
                Rest<span className="text-blue-600">Sync</span>
              </span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="mr-1.5 h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* User profile & logout */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold">
                  {user?.nome?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user?.nome}</p>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 mt-0.5 text-[10px] font-medium text-blue-700 capitalize border border-blue-100">
                    {user?.tipo_usuario}
                  </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  <NavLink
                    to="/perfil"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                  >
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    Meu Perfil
                  </NavLink>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-4 space-y-1 shadow-lg">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
          <div className="border-t border-slate-100 pt-3 mt-2 space-y-1">
            <NavLink
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              <User className="mr-3 h-5 w-5" />
              Meu Perfil
            </NavLink>
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
