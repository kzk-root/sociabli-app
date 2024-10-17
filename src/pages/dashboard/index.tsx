import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [token, setToken] = useState<string>('')

  useEffect(() => {
      const fetchData = async () => {
        const token = await getToken()

        if(!token) return

        setToken(token)
      }

      fetchData()
  }, [getToken, setToken])

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:3000/api/protected' // FIXME
        fetch(url, {
          method: 'POST',
          headers: {
            // "x-access-token": "lass_mich_rein_hack",
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json())
    }

    fetchData()
  }, [token])

  return (
    <>
      <h1>Dashboard page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li>
          <Link to="/">Return to index</Link>
        </li>
      </ul>
    </>
  )
}
