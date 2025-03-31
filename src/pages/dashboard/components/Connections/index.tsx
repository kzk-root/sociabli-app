import EnvVars from '@/services/EnvVars.ts'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { ConnectionTypeIcon } from '@/pages/dashboard/components/ConnectionTypeIcon'
import { Loader } from '@/pages/dashboard/components/Loader'
import { ShowErrorToast, ShowSuccessToast } from '@/components/toast'
import log from 'loglevel'

export const Connections = () => {
  const { getToken } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [userConnections, setUserConnections] = useState([])
  const [showMastodonForm, setShowMastodonForm] = useState(false)
  const [showBlueskyForm, setShowBlueskyForm] = useState(false)

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

  const connectBluesky = async (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const userHandle = formData.get('userHandle') as string
    const appPassword = formData.get('appPassword') as string
    const token = await getToken()

    fetch(`${EnvVars.netlifyFunctions}/blueskyCreateConnection`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userHandle, appPassword }),
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
        setShowBlueskyForm(false)
        window.location.reload()
      })
  }

  const renderConnection = (connection: any) => {
    const label = connection.label.split(' - ')

    return (
      <li key={connection.id}>
        <div className="card-base">
          <div className="user-connection">
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

  const renderConnections = () => {
    if (isLoading) {
      return <Loader />
    }

    if (userConnections.length === 0) {
      return (
        <div className={'no-data'}>
          No connections found. You can create a new one by clicking on the service above.
        </div>
      )
    }

    return (
      <ul className={'user-connections'}>
        {userConnections.map((connection: any) => renderConnection(connection))}
      </ul>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchConnections()
    }

    fetchData()
  }, [])

  return (
    <>
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
        <li
          key={'bluesky'}
          onClick={() => {
            setShowBlueskyForm(true)
          }}
        >
          <div className="new-connection">
            <ConnectionTypeIcon connectionType="bluesky" />
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

      {showBlueskyForm && (
        <dialog id={'blueskyConnection'}>
          <form onSubmit={connectBluesky}>
            <label>User handle</label>
            <input
              type={'text'}
              name={'userHandle'}
              placeholder={'@bluesky-handle'}
              pattern={'^(@|)[a-zA-Z0-9_\\-]{1,60}\\.[a-zA-Z0-9_]{2,}\\.[a-zA-Z]{2,}$'}
            />

            <label>App password</label>
            <input
              type={'password'}
              name={'appPassword'}
              pattern={'^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$'}
            />

            <div className="footer">
              <button className={'cancel'} type="button" onClick={() => setShowBlueskyForm(false)}>
                Cancel
              </button>
              <button type="submit">Connect</button>
            </div>
          </form>
        </dialog>
      )}

      <h4>Your connections</h4>
      {renderConnections()}
    </>
  )
}
