import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

type FieldSet = {
  id: string
  name: string
  type: string
}
type Workflow = {
  id: string
  name: string
  description: string
  fields: FieldSet[]
}

const BASE_URL = 'http://localhost:8888/.netlify/functions'

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [token, setToken] = useState<string>()
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()

      if (!token) return

      setToken(token)
    }

    fetchData()
  }, [getToken, setToken])

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${BASE_URL}/getUserWorkflows`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setUserWorkflows(json)
        })

      fetch(`${BASE_URL}/getWorkflows`, {
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

    if (!token) return

    fetchData()
  }, [token])

  const renderUserWorkflows = () => {
    if (!userWorkflows) {
      return '<div>no workflows</div>'
    }

    return (
      <ul>
        {userWorkflows.map((workflow) => (
          <li key={workflow.id}>{workflow.name}</li>
        ))}
      </ul>
    )
  }

  const renderWorkflow = () => {
    if (!workflows) {
      return '<div>no workflows</div>'
    }

    return (
      <ul>
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            <details>
              <summary>{workflow.name}</summary>

              <p>{workflow.description}</p>
              <form method="POST" onSubmit={activateWorkflow}>
                <input type="hidden" name="workflowId" value={workflow.id} />
                {workflow.fields.map((field) => (
                  <label key={field.id}>
                    {field.name}
                    <input type={field.type || 'text'} name={field.id} />
                  </label>
                ))}
                <button type="submit">Submit</button>
              </form>
            </details>
          </li>
        ))}
      </ul>
    )
  }

  const activateWorkflow = async (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.target) // Create FormData object

    const formFields = []
    const workflowId = formData.get('workflowId')
    for (const [id, value] of formData.entries()) {
      if (id === 'workflowId') continue
      formFields.push({ id, value })
    }

    await fetch(`${BASE_URL}/activateWorkflow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workflowId,
        fields: formFields,
      }),
    })
  }

  return (
    <>
      <h1>Dashboard page</h1>
      <p>This is a protected page.</p>

      <h2>Your workflows</h2>
      {renderUserWorkflows()}

      <h2>Known workflows</h2>
      {renderWorkflow()}

      <ul>
        <li>
          <Link to="/">Return to index</Link>
        </li>
      </ul>
    </>
  )
}
