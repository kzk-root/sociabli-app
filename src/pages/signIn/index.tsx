import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="container dashboard">
      <div className="centered">
        <SignIn path="/sign-in" redirectUrl={'/dashboard'} />
      </div>
    </div>
  )
}
