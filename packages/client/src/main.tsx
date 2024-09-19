import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './pages/root'
import ErrorPage from './pages/errorPage'
import Explore from './pages/explore'
import Users from './pages/users'
import NewPost from './pages/newPost'
import LoginPage from './pages/login'
import Profile from './pages/profile'
import EditPost from './pages/editPost'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'highlight.js/styles/default.min.css'
import './index.css'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/explore" replace />, // This will redirect to /explore
      },
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'makePost',
        element: <NewPost />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'editPost',
        element: <EditPost />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)