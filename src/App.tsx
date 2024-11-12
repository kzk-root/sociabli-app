import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '@/components/RootLayout.tsx'
import DashboardLayout from '@/components/DashboardLayout.tsx'
import SignInPage from '@/pages/signIn'
import SignUpPage from '@/pages/signUp'
import DashboardPage from '@/pages/dashboard'
import IndexPage from '@/pages/index'
import TermsOfServicePage from '@/pages/terms'
import PrivacyPage from '@/pages/privacy'
import ImprintPage from '@/pages/imprint'
import FaqPage from '@/pages/faq'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
      { path: '/terms', element: <TermsOfServicePage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/imprint', element: <ImprintPage /> },
      { path: '/faq', element: <FaqPage /> },
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
  return <RouterProvider router={router} />
}

export default App
