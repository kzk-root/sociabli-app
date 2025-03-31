import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Tippy from '@tippyjs/react'
import { ConnectionTypeIcon } from '@/pages/dashboard/components/ConnectionTypeIcon'
import EnvVars from '@/services/EnvVars.ts'
import { toast } from 'react-toastify'

export type Flow = {
  id: string
  status: string
  connectionFrom: { label: string; connectionType: string }
  connectionTo: { label: string; connectionType: string }
}

export const UserFlows = () => {
  const { getToken } = useAuth()
  const [userWorkflows, setUserWorkflows] = useState<Flow[]>([])

  const fetchUserWorkflows = async () => {
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
      .catch(() => {
        toast('Could not activate workflow. Please try again later.')
      })
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

    fetchUserWorkflows()
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserWorkflows()
    }

    fetchData()
  }, [])

  if (!userWorkflows || !Array.isArray(userWorkflows) || userWorkflows.length === 0) {
    return <div className={'no-data'}>No active flows. Create a new one below.</div>
  }

  return (
    <ul className={'user-workflows'}>
      {userWorkflows.map((workflow) => {
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
                <ConnectionTypeIcon connectionType={workflow.connectionFrom.connectionType} />
                <p className="service">{workflow.connectionFrom.label}</p>
              </div>
              <svg className="connection" width="50" height="100" viewBox="0 0 50 100">
                <line x1="0" y1="50" x2="50" y2="50" stroke="#358C9C" stroke-width="2" />
              </svg>
              <div className="card card2">
                <ConnectionTypeIcon connectionType={workflow.connectionTo.connectionType} />
                <p className="service">{workflow.connectionTo.label}</p>
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
