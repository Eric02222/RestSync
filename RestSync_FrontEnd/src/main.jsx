import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './layout/Layout.jsx'
import Error from './pages/Error.jsx'
import { AuthProvider } from './context/context.jsx'
import { ToastContainer } from 'react-toastify';
import Cadastro from './pages/Cadastro/Cadastro.jsx'


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      { path: '/cadastro', element: <Cadastro /> },
      { path: '*', element: <Error /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false} />
    </AuthProvider>
  </StrictMode>,
)
