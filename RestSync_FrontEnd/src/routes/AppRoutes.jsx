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
      { path: '/dashboard', element: <Dashboard /> },
      { 
        path: '/pacientes', 
        element: (
          <ProtectedRoute allowedRoles={['admin', 'medico']}>
            <Pacientes />
          </ProtectedRoute>
        ) 
      },
      { path: '/historico', element: <Historico /> },
    ],
  },
  // Fallback Wildcard Route (404 Error page)
  {
    path: '*',
    element: <Error />,
  },
]);

export default router;
