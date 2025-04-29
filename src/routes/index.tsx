import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Dashboard from '../pages/Dashboard'
import { useUserStore } from '../store/userStore'

const Routes: React.FC = () => {
  const isOnboarded = useUserStore(state => state.isOnboarded)

  // Create the router with protected routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: isOnboarded ? <Navigate to="/dashboard" /> : <Welcome />,
    },
    {
      path: '/welcome',
      element: isOnboarded ? <Navigate to="/dashboard" /> : <Welcome />,
    },
    {
      path: '/dashboard',
      element: isOnboarded ? <Dashboard /> : <Navigate to="/welcome" />,
    },
    // Other routes will be added here
  ])

  return <RouterProvider router={router} />
}

export default Routes