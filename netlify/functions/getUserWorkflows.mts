import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

type Workflow = {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
}

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

    return (await response.json()) as ExecutionResponse
  } catch (error) {
    return { data: [], nextCursor: null }
  }
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

  try {
    const customHeaders = new Headers()
    customHeaders.set('X-N8N-API-KEY', retrievePrivateMetadataResult.data.n8nApiKey)

    const response = await fetch(FunctionEnvVars.n8nApiUrl + '/workflows', {
      method: 'GET',
      headers: customHeaders,
    })

    console.log('[getUserWorkflows] Prepare workflows')
    const data = await response.json()
    const workflowList: Workflow[] = []

    for (const workflow of data.data) {
      if (!workflow.tags.find((child: any) => child.name === 'hideInUi')) {
        const executions = await getWorkflowExecutions(
          workflow.id,
          retrievePrivateMetadataResult.data.n8nApiKey
        )

        if (executions.data.length === 0) {
          workflowList.push({
            id: workflow.id,
            name: workflow.name
              .replace(` - ${retrievePrivateMetadataResult.data.userId}`, '')
              .replace('Subworkflow - ', ''),
            status: 'pending',
          })
          continue
        }

        const isRunning = executions.data.find((execution) => {
          return execution.stoppedAt === null || execution.stoppedAt.length === 0
        })

        const isFinished = executions.data.find((execution) => execution.finished)
        const status = isRunning ? 'running' : isFinished ? 'success' : 'error'

        workflowList.push({
          id: workflow.id,
          name: workflow.name.replace(` - ${retrievePrivateMetadataResult.data.userId}`, ''),
          status: status,
        })
      }
    }

    return Response.json(workflowList)
  } catch (error) {
    console.log('[getUserWorkflows] Error thrown', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json(
      { error: `Failed fetching user workflows: ${errorMessage}` },
      { status: 500 }
    )
  }
}
