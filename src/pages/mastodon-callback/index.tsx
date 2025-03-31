import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import EnvVars from '@/services/EnvVars.ts'
import { useAuth } from '@clerk/clerk-react'
import log from 'loglevel'
import { ShowErrorToast, ShowSuccessToast } from '@/components/toast'
import { Loader } from '@/pages/dashboard/components/Loader'

export default function MastodonCallback() {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const code = searchParams.get('code')

  useEffect(() => {
    const getData = async () => {
      if (code !== null) {
        const token = await getToken()

        const mastodonInstance = window.sessionStorage.getItem('mastodonInstance')
        const mastodonUserHandle = window.sessionStorage.getItem('mastodonUserHandle')

        fetch(`${EnvVars.netlifyFunctions}/mastodonCreateConnection`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mastodonInstance, mastodonUserHandle, code }),
        })
          .then((res) => {
            if (res.ok) {
              ShowSuccessToast('Successful', 'Connection created successfully')
              return
            }

            ShowErrorToast('Error', 'Could not connect. Please try again later.')
          })
          .catch(() => {
            log.debug('Could not connect. Please try again later.')
            ShowErrorToast('Error', 'Could not connect. Please try again later.')
          })
          .finally(() => {
            window.sessionStorage.setItem('mastodonInstance', '')
            window.sessionStorage.setItem('mastodonUserHandle', '')
            navigate('/dashboard')
          })
      }
    }

    getData()
  }, [code])

  return (
    <div className={'callbackScreen'}>
      <Loader />
    </div>
  )
}
