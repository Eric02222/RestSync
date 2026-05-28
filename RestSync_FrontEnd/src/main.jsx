import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Error from './pages/Error.jsx'
import { AuthProvider } from './context/context.jsx'

const router = createBrowserRouter([
  {
    element: <Navbar/>,
    children: [
      {path: '*', element: <Error/>}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
