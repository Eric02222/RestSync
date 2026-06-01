import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/context';
import { HeartPulse, LayoutDashboard, Users, History, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      roles: ['admin', 'medico'], // familiar does not have full patient CRUD
    },
    {
      to: '/historico',
      label: 'Histórico',
      icon: History,
      roles: ['admin', 'medico', 'familiar'],
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
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* User profile & logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-3 border-r border-slate-200 pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.nome}</p>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 mt-1 text-xs font-medium text-blue-700 capitalize border border-blue-100">
                  {user?.tipo_usuario}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors duration-200 cursor-pointer p-2 rounded-xl hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
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
          <div className="border-t border-slate-100 pt-4 mt-4 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.nome}</p>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 mt-1 text-xs font-medium text-blue-700 capitalize border border-blue-100">
                  {user?.tipo_usuario}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-red-600 transition-colors duration-200 cursor-pointer p-2 rounded-xl hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
