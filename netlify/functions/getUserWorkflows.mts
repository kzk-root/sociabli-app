import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'
import supabaseClient from './utils/SupabaseClient.mjs'

type ExecutionResponseItem = {
  id: string
  finished: boolean
  mode: 'cli' | 'error' | 'integrated' | 'internal' | 'manual' | 'retry' | 'trigger' | 'webhook'
  retryOf: null | number
  retrySuccessId: null | number
  startedAt: string | null
  stoppedAt: string | null
  workflowId: string
  waitTill: null | string
  customData: unknown
}
type ExecutionResponse = {
  data: ExecutionResponseItem[]
  nextCursor: null | string
}

/**
 * Retrieve all user workflows with the resolved connections and the workflow n8n state
 *
 * @param workflowId
 * @param n8nApiKey
 */
const getWorkflowExecutions = async (
  workflowId: string,
  n8nApiKey: string
): Promise<ExecutionResponse> => {
  try {
    const customHeaders = new Headers()
    customHeaders.set('X-N8N-API-KEY', n8nApiKey)

    const response = await fetch(
      FunctionEnvVars.n8nApiUrl + `/executions?workflowId=${workflowId}&limit=1`,
      {
        method: 'GET',
        headers: customHeaders,
      }
    )

    if (!response.ok) {
      console.log('[getUserWorkflows] Error fetching workflow executions', response.statusText)
      return { data: [], nextCursor: null }
    }

    return (await response.json()) as ExecutionResponse
  } catch (error) {
    return { data: [], nextCursor: null }
  }
}

type WorkflowConnection = {
  connectionType: string
  label: string
}

type WorkflowExecution = {
  id: string // sociabli workflow id from table "sociabli_workflows"
  status: 'pending' | 'running' | 'success' | 'error' // n8n internal status value
  connectionFrom: WorkflowConnection
  connectionTo: WorkflowConnection
}

export default async (request: Request, _context: Context) => {
  console.log('[getUserWorkflows] Start')
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log('[getUserWorkflows] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const userId = retrievePrivateMetadataResult.data.userId

  try {
    const workflowResult = await supabaseClient
      .from('sociabli_workflows')
      .select(
        `
      id,
      connection_from:sociabli_connections!sociabli_workflows_connection_from_fkey(id,connection_type,label),
      connection_to:sociabli_connections!sociabli_workflows_connection_to_fkey(id,connection_type,label),
      n8n_workflow_id
    `
      )
      .eq('user_id', userId)
      .throwOnError()

    const workflows: WorkflowExecution[] = []
    const n8nApiKey = retrievePrivateMetadataResult.data.n8nApiKey

    for await (const workflow of workflowResult.data) {
      const n8nWorkflowExecutionResult = await getWorkflowExecutions(
        workflow.n8n_workflow_id,
        n8nApiKey
      )

      const connectionTo = {
        // @ts-ignore Supabase’s TypeScript generator defaults to assuming foreign keys can return multiple rows
        connectionType: workflow.connection_to.connection_type,
        // @ts-ignore Supabase’s TypeScript generator defaults to assuming foreign keys can return multiple rows
        label: workflow.connection_to.label,
      }
      const connectionFrom = {
        // @ts-ignore Supabase’s TypeScript generator defaults to assuming foreign keys can return multiple rows
        connectionType: workflow.connection_from.connection_type,
        // @ts-ignore Supabase’s TypeScript generator defaults to assuming foreign keys can return multiple rows
        label: workflow.connection_from.label,
      }

      if (!n8nWorkflowExecutionResult.data || n8nWorkflowExecutionResult.data.length === 0) {
        workflows.push({ id: workflow.id, status: 'pending', connectionTo, connectionFrom })
        continue
      }

      const isRunning = n8nWorkflowExecutionResult.data.find((execution) => {
        return execution.stoppedAt === null || execution.stoppedAt.length === 0
      })

      const isFinished = n8nWorkflowExecutionResult.data.find((execution) => execution.finished)
      const status = isRunning ? 'running' : isFinished ? 'success' : 'error'

      workflows.push({ id: workflow.id, status: status, connectionTo, connectionFrom })
    }

    return Response.json(workflows)
  } catch (error) {
    console.log('[getUserWorkflows] Error thrown', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json(
      { error: `Failed fetching user workflows: ${errorMessage}` },
      { status: 500 }
    )
  }
}
