import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import EnvVars from '@/services/EnvVars.ts'

export default function RootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={EnvVars.clerkPublishableKey}
    >
      <header className="page">
        <nav>
          <Link to="/">Crossposter</Link>
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
        <a href={'#'}>Privacy Policy</a>
        <a href={'#'}>Terms of Service</a>
        <a href={'#'}>Contact</a>
      </footer>
    </ClerkProvider>
  )
}
