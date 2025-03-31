import { useEffect, useState } from 'react'
import ConnectionIcon from '@/components/icons/connection.tsx'
import { ConnectionTypeIcon } from '@/pages/dashboard/components/ConnectionTypeIcon'
import Tippy from '@tippyjs/react'
import { ShowErrorToast } from '@/components/toast'
import EnvVars from '@/services/EnvVars.ts'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import { Loader } from '@/pages/dashboard/components/Loader'

export type FieldSet = {
  id: string
  name: string
  type: string
  connectionType?: string
  link?: {
    href: string
    text: string
  }
  placeholder?: string
  errorHint?: string
  description?: string
  pattern?: string
}

export type Workflow = {
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

interface Props {
  onCreated: () => void
}

export const Workflows = ({ onCreated }: Props) => {
  const { getToken } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [userConnections, setUserConnections] = useState([])

  const activateWorkflow = async (event: any) => {
    event.preventDefault()
    const token = await getToken()
    const formData = new FormData(event.target) // Create FormData object

    const connectionFrom = formData.get('connectionFrom')
    const connectionTo = formData.get('connectionTo')

    setIsLoading(true)
    await fetch(`${EnvVars.netlifyFunctions}/createUserWorkflow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        connectionFrom,
        connectionTo,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // happy path: no code, means no error
        if (!json.code) {
          setIsLoading(false)
          onCreated()
          return
        }

        // whatever we do to handle the error, we throw the error to see the toast message
        throw new Error(json.error)
      })
      .catch((error) => {
        ShowErrorToast('Failed to create workflow', error.message)
        return null
      })
  }

  const renderFieldByType = (field: FieldSet) => {
    if (field.type === 'connection') {
      const connectionOptions = userConnections.filter(
        (connection: any) => connection.connection_type === field.connectionType
      )

      return (
        <select name={field.id} required={true}>
          <option value="" disabled>
            Select {field.name}
          </option>
          {connectionOptions.map((connection: any) => (
            <option key={connection.id} value={connection.id}>
              {connection.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type || 'text'}
        name={field.id}
        pattern={field.pattern}
        required={true}
        placeholder={field.placeholder}
        title={field.errorHint}
      />
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()

      setIsLoading(true)
      fetch(`${EnvVars.netlifyFunctions}/getWorkflows`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setWorkflows(json)
          setIsLoading(false)
        })

      fetch(`${EnvVars.netlifyFunctions}/getUserConnections`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setUserConnections(json)
        })
        .catch(() => {
          toast.error('Could not get connections. Please try again later.')
        })
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
    return <div className={'no-data'}>Loading available flows…</div>
  }

  return (
    <ul>
      {workflows.map((workflow) => {
        const fieldsFrom = workflow.fields.filter((field) => field.id === 'connectionFrom')
        const fieldsTo = workflow.fields.filter((field) => field.id === 'connectionTo')

        return (
          <li key={workflow.id}>
            <details className="animated-details">
              <summary className="flow small-flow">
                <div className="card-base flow-connection card1">
                  <ConnectionTypeIcon connectionType={workflow.flow?.from.icon || ''} />
                  <p className="service">{workflow.flow?.from.label}</p>
                </div>
                <ConnectionIcon />
                <div className="card-base flow-connection card2">
                  <ConnectionTypeIcon connectionType={workflow.flow?.to.icon || ''} />
                  <p className="service">{workflow.flow?.to.label}</p>
                </div>
              </summary>
              <div className="details">
                <form method="POST" onSubmit={activateWorkflow}>
                  <div className="fields">
                    <div>
                      {fieldsFrom.map((field) => (
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
                              {field.link && (
                                <a href={field.link.href} target="_blank" rel="noreferrer">
                                  <span>{field.link.text}</span>
                                </a>
                              )}
                            </label>
                          </Tippy>
                          {renderFieldByType(field)}
                        </div>
                      ))}
                    </div>
                    <div>
                      {fieldsTo.map((field) => (
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
                              {field.link && (
                                <a href={field.link.href} target="_blank" rel="noreferrer">
                                  <span>{field.link.text}</span>
                                </a>
                              )}
                            </label>
                          </Tippy>
                          {renderFieldByType(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="submit">{workflow.description}</button>
                </form>
              </div>
            </details>
          </li>
        )
      })}
    </ul>
  )
}
