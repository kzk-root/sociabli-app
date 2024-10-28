import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="container dashboard">
      <div className="centered">
        <SignUp path="/sign-up" />
      </div>
    </div>
  )
}
