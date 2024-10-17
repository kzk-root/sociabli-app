import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '@/components/RootLayout.tsx'
import DashboardLayout from '@/components/DashboardLayout.tsx'
import ContactPage from '@/pages/contact'
import SignInPage from '@/pages/signIn'
import SignUpPage from '@/pages/signUp'
import DashboardPage from '@/pages/dashboard'
import IndexPage from '@/pages/index'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: 'dashboard',
        children: [{ path: '/dashboard', element: <DashboardPage /> }],
      },
    ],
  },
])

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
