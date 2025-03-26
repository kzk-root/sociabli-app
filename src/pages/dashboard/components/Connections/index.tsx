import EnvVars from '@/services/EnvVars.ts'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { ConnectionTypeIcon } from '@/pages/dashboard/components/ConnectionTypeIcon'
import { Loader } from '@/pages/dashboard/components/Loader'

export const Connections = () => {
  const { getToken } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [userConnections, setUserConnections] = useState([])
  const [showMastodonForm, setShowMastodonForm] = useState(false)

  const disconnectMastodon = async (id: any) => {
    const token = await getToken()
    setIsLoading(true)

    fetch(`${EnvVars.netlifyFunctions}/deleteUserConnection`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsLoading(false)
        fetchConnections()
      })
      .catch(() => {
        toast('Could not connect. Please try again later.')
      })
  }

  const connectMastodon = async (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const instance = formData.get('instance') as string
    const userHandle = formData.get('userHandle') as string

    window.sessionStorage.setItem('mastodonInstance', instance)
    window.sessionStorage.setItem('mastodonUserHandle', userHandle)

    fetch(`${EnvVars.netlifyFunctions}/mastodonGetInstance`, {
      method: 'POST',
      body: JSON.stringify({ instance: instance }),
    })
      .then((res) => res.json())
      .then((json) => {
        const authUrl =
          `https://${json.instanceHostname}/oauth/authorize?` +
          `client_id=${encodeURIComponent(json.clientId)}` +
          `&redirect_uri=${encodeURIComponent(json.redirectUri)}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent(json.scope)}`

        window.location.href = authUrl
      })
      .catch(() => {
        toast('Could not connect. Please try again later.')
      })
  }

  const renderConnection = (connection: any) => {
    const label = connection.label.split(' - ')
    return (
      <li key={connection.id}>
        <div className="flow small-flow">
          <div className="card">
            <ConnectionTypeIcon connectionType={connection.connection_type} />
            <p className="label">
              {label[1]}
              <br />
              <small>
                <em>{label[0]}</em>
              </small>
            </p>
            <div className={'actions'}>
              <button
                className={'delete'}
                type={'button'}
                onClick={() => disconnectMastodon(connection.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </li>
    )
  }

  const fetchConnections = useCallback(async () => {
    const token = await getToken()

    setIsLoading(true)

    fetch(`${EnvVars.netlifyFunctions}/getUserConnections`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setIsLoading(false)
        setUserConnections(json)
      })
      .catch(() => {
        toast.error('Could not get connections. Please try again later.')
      })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await fetchConnections()
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <ul className={'user-connections'}>
        {userConnections.map((connection: any) => renderConnection(connection))}
      </ul>

      <h4>Add new connection</h4>
      <ul className={'new-connections'}>
        <li
          key={'mastodon'}
          onClick={() => {
            setShowMastodonForm(true)
          }}
        >
          <div className="new-connection">
            <ConnectionTypeIcon connectionType="mastodon" />
          </div>
        </li>
      </ul>

      {showMastodonForm && (
        <dialog id={'mastodonConnection'}>
          <form onSubmit={connectMastodon}>
            <label>Instance URL</label>
            <input type={'url'} name={'instance'} placeholder={'https://mastodon.social'} />
            <label>User handle</label>
            <input type={'text'} name={'userHandle'} placeholder={'@username'} />

            <div className="footer">
              <button className={'cancel'} type="button" onClick={() => setShowMastodonForm(false)}>
                Cancel
              </button>
              <button type="submit">Connect</button>
            </div>
          </form>
        </dialog>
      )}
    </>
  )
}
