import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import 'tippy.js/dist/tippy.css'
import Tippy from '@tippyjs/react'
import EnvVars from '@/services/EnvVars.ts'
import ConnectionIcon from '@/components/icons/connection.tsx'
import MastodonIcon from '@/components/icons/mastodon.tsx'
import BlueskyIcon from '@/components/icons/bluesky.tsx'
import MediumIcon from '@/components/icons/medium.tsx'
import BlogIcon from '@/components/icons/blog.tsx'

type FieldSet = {
  id: string
  name: string
  type: string
  description?: string
}

type Workflow = {
  id: string
  name: string
  description: string
  flow?: {
    from: { label: string; icon: string }
    to: { label: string; icon: string }
  }
  fields: FieldSet[]
  status?: string
}

type UserData = {
  path: string
  credential: string
}

type Flow = {
  from: { label: string; icon: string }
  to: { label: string; icon: string }
}

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [userData, setUserData] = useState<UserData>()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    const msg = document.querySelector('.msg')

    if (msg) {
      msg.classList.add('show')

      msg.addEventListener('animationend', () => {
        msg.classList.remove('show')
      })
    }
  }

  const renderIcon = (icon?: string) => {
    if (!icon) return null

    switch (icon) {
      case 'MastodonIcon':
        return <MastodonIcon />
      case 'BlueskyIcon':
        return <BlueskyIcon />
      case 'MediumIcon':
        return <MediumIcon />
      case 'BlogIcon':
        return <BlogIcon />
      default:
        return null
    }
  }

  const renderUserWorkflows = () => {
    if (!userWorkflows || !Array.isArray(userWorkflows) || userWorkflows.length === 0) {
      return <div className={'no-data'}>No active flows. Create a new one below.</div>
    }

    return (
      <ul className={'user-workflows'}>
        {userWorkflows.map((workflow) => {
          let flow: Flow = {
            from: { label: 'Mastodon', icon: 'MastodonIcon' },
            to: { label: 'Bluesky', icon: 'BlueskyIcon' },
          }

          switch (workflow.name) {
            case 'Mastodon to Bluesky':
              flow = {
                from: { label: 'Mastodon', icon: 'MastodonIcon' },
                to: { label: 'Bluesky', icon: 'BlueskyIcon' },
              }
              break
            case 'Blog to Medium':
              flow = {
                from: { label: 'Blog', icon: 'BlogIcon' },
                to: { label: 'Medium', icon: 'MediumIcon' },
              }
              break
          }

          const statusMsg =
            workflow.status === 'error'
              ? 'Your last post could not be cross posted. We will try again later.'
              : workflow.status

          return (
            <li key={workflow.id}>
              <Tippy content={statusMsg} placement="top-start">
                <div className={`status ${workflow.status}`}></div>
              </Tippy>
              <div className="flow small-flow active-flow">
                <div className="card card1">
                  {renderIcon(flow.from.icon)}
                  <p className="service">{flow.from.label}</p>
                </div>
                <svg className="connection" width="50" height="100" viewBox="0 0 50 100">
                  <line x1="0" y1="50" x2="50" y2="50" stroke="#358C9C" stroke-width="2" />
                </svg>
                <div className="card card2">
                  {renderIcon(flow.to.icon)}
                  <p className="service">{flow.to.label}</p>
                </div>
              </div>
              <form method="POST" onSubmit={deleteWorkflow}>
                <input type="hidden" name="workflowId" value={workflow.id} />
                <button type="submit" className={'delete'}>
                  Delete
                </button>
              </form>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderWorkflow = () => {
    if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
      return <div className={'no-data'}>Loading available flows…</div>
    }

    return (
      <ul>
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            <details className="animated-details">
              <summary className="flow small-flow">
                <div className="card card1">
                  {renderIcon(workflow.flow?.from.icon)}
                  <p className="service">{workflow.flow?.from.label}</p>
                </div>
                <ConnectionIcon />
                <div className="card card2">
                  {renderIcon(workflow.flow?.to.icon)}
                  <p className="service">{workflow.flow?.to.label}</p>
                </div>
              </summary>
              <div className="details">
                <p>{workflow.description}</p>
                <form method="POST" onSubmit={activateWorkflow}>
                  <input type="hidden" name="workflowId" value={workflow.id} />
                  {workflow.fields.map((field) => (
                    <div key={field.id}>
                      <Tippy
                        content={field.description || ''}
                        placement="top-start"
                        interactive={true}
                      >
                        <label key={field.id}>
                          {field.name}{' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path>
                          </svg>
                        </label>
                      </Tippy>

                      <input type={field.type || 'text'} name={field.id} />
                    </div>
                  ))}
                  <button type="submit">Create flow</button>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>
    )
  }

  const renderUserData = () => {
    if (!userData) {
      return <div className={'no-data'}>No available workflows. Come back soon.</div>
    }

    return (
      <>
        <label htmlFor="path" data-tippy-content="Click to Copy">
          WebhookId
          <Tippy content="Click to Copy to clipboard" placement="top-start">
            <input
              type="text"
              value={userData.path}
              name="path"
              id="path"
              readOnly={true}
              onClick={() => {
                copyToClipboard(userData.path)
              }}
            />
          </Tippy>
        </label>
        <label htmlFor="token" data-tippy-content="Click to Copy">
          Token
          <Tippy content="Click to Copy to clipboard" placement="top-start">
            <input
              type="text"
              value={userData.credential}
              name="token"
              id="token"
              readOnly={true}
              onClick={() => {
                copyToClipboard(userData.credential)
              }}
            />
          </Tippy>
        </label>
      </>
    )
  }

  const fetchUserData = async () => {
    const token = await getToken()

    fetch(`${EnvVars.netlifyFunctions}/getUserData`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setUserData(json)
      })
  }

  const fetchWorkflows = async () => {
    const token = await getToken()

    fetch(`${EnvVars.netlifyFunctions}/getUserWorkflows`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setUserWorkflows(json)
      })

    fetch(`${EnvVars.netlifyFunctions}/getWorkflows`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setWorkflows(json)
      })
  }

  const activateWorkflow = async (event: any) => {
    event.preventDefault()
    const token = await getToken()
    const formData = new FormData(event.target) // Create FormData object

    const formFields = []
    const workflowId = formData.get('workflowId')
    for (const [id, value] of formData.entries()) {
      if (id === 'workflowId') continue
      formFields.push({ id, value })
    }

    const response = await fetch(`${EnvVars.netlifyFunctions}/activateWorkflow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workflowId,
        fields: formFields,
      }),
    })

    if (response.ok) {
      event.target.reset()
      fetchWorkflows()
    }
  }

  const deleteWorkflow = async (event: any) => {
    event.preventDefault()
    const token = await getToken()
    const formData = new FormData(event.target) // Create FormData object

    const formFields = []
    const workflowId = formData.get('workflowId')
    for (const [id, value] of formData.entries()) {
      if (id === 'workflowId') continue
      formFields.push({ id, value })
    }

    await fetch(`${EnvVars.netlifyFunctions}/deleteWorkflow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workflowId,
      }),
    })

    fetchWorkflows()
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchWorkflows()
      await fetchUserData()
    }

    fetchData()
  }, [])

  return (
    <div className="container dashboard">
      <div className="msg">Copied</div>
      <section>
        <h1>Dashboard</h1>
        <p className="intro" data-tippy-content={'hallo welt'}>
          See all available workflows and the once you activated.
        </p>
      </section>

      <h2>Your flows</h2>
      {renderUserWorkflows()}

      <h2>Available flows</h2>
      <p className="description">
        Click on a flow to configure it. Enter the needed information to activate the flow. Our
        flows will start working with your next post, we will not publish older posts.
      </p>
      {renderWorkflow()}

      <div className={'credentials'}>
        <h2>Webhook</h2>

        <details className="creds animated-details">
          <summary>Your Webhook credentials</summary>
          <div className="details">{renderUserData()}</div>
        </details>

        <details className="animated-details">
          <summary>How to use the Webhook</summary>
          <div className="details">
            <p>
              In case you want to use the webhook directly because we not yet support your CMS, you
              can do so. Send a <code>POST</code> request to:
              <pre>
                <code className="code-block">https://webhook.sociab.li/{userData?.path}</code>
              </pre>
            </p>
            <p>
              With the following headers:
              <pre>
                <code className="code-block">
                  {`{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ${userData?.credential}'
}`}
                </code>
              </pre>
            </p>
            <p>
              Send a body with the following structure:
              <pre>
                <code className="code-block">
                  {`{
  'title': 'Your post title',
  'intro': 'A short intro text',
  'text': 'The main content of your post, Markdown is supported',
  'tags': 'some, tags, for, your, post',
  'url': 'canonical url of your post',
  'publishStatus': 'draft' | 'published',
}`}
                </code>
              </pre>
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
