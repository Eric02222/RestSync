import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';

// Security
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Pacientes from '../pages/Pacientes/Pacientes';
import Historico from '../pages/Historico/Historico';
import Usuarios from '../pages/Usuarios/Usuarios';
import Perfil from '../pages/Perfil/Perfil';
import Alertas from '../pages/Alertas/Alertas';
import Logs from '../pages/Logs/Logs';
import Error from '../pages/Error';

const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
    ],
  },
  // Private Protected Routes
  {
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard — todos os perfis
      { path: '/dashboard', element: <Dashboard /> },

      // Gestão de residentes — admin e médico
      {
        path: '/pacientes',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'medico']}>
            <Pacientes />
          </ProtectedRoute>
        ),
      },

      // Histórico — todos os perfis
      { path: '/historico', element: <Historico /> },

      // Central de Alertas — todos os perfis
      { path: '/alertas', element: <Alertas /> },

      // Perfil do usuário logado — todos os perfis
      { path: '/perfil', element: <Perfil /> },

      // Painel de Usuários — admin only
      {
        path: '/usuarios',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Usuarios />
          </ProtectedRoute>
        ),
      },

      // Auditoria / Logs — admin only
      {
        path: '/logs',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Logs />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Fallback Wildcard Route (404 Error page)
  {
    path: '*',
    element: <Error />,
  },
]);

export default router;
