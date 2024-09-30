import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'highlight.js/styles/default.min.css'
import './index.css'
import EditPost from './pages/editPost'
import ErrorPage from './pages/errorPage'
import Explore from './pages/explore'
import Home from './pages/home'
import Jam from './pages/jamPage'
import LoginPage from './pages/login'
import PostDetails from './pages/postDetails'
import Profile from './pages/profile'
import Root from './pages/root'
import User from './pages/user'
import Users from './pages/users'
import { queryClient } from './queries/queryClient'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
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
        path: 'user/:id',
        element: <User />,
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
        path: 'editPost/:id',
        element: <EditPost />,
      },
      {
        path: 'posts/:id',
        element: <PostDetails />,
      },
      {
        path: 'jam/:id',
        element: <Jam />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
)
