import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/context';
import { useTheme } from '../../context/ThemeContext';
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
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      roles: ['admin', 'medico'],
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
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <div className="flex flex-shrink-0 items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <span className="ml-3 font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
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
                          ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
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

          {/* User profile, theme toggle & logout */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold">
                  {user?.nome?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{user?.nome}</p>
                  <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 mt-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300 capitalize border border-blue-100 dark:border-blue-800">
                    {user?.tipo_usuario}
                  </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50">
                  <NavLink
                    to="/perfil"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                  >
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    Meu Perfil
                  </NavLink>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 cursor-pointer"
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
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 pt-2 pb-4 space-y-1 shadow-lg">
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
                      ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 space-y-1">
            <NavLink
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              <User className="mr-3 h-5 w-5" />
              Meu Perfil
            </NavLink>
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 cursor-pointer"
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
