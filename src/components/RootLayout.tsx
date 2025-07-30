import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import EnvVars from '@/services/EnvVars.ts'
import { ToastContainer } from 'react-toastify'

export default function RootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={EnvVars.clerkPublishableKey}
      signInForceRedirectUrl="/dashboard"
    >
      <header className="page">
        <nav>
          <Link to="/">Sociabli</Link>
          <a href={'https://sociab.li/blog'} target="_blank">
            Blog
          </a>
          <SignedIn>
            <Link to="/dashboard">Dashboard</Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>

      <footer>
        <Link to="/faq">FAQ</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/imprint">Imprint</Link>
      </footer>
      <ToastContainer position="bottom-center" />
    </ClerkProvider>
  )
}
