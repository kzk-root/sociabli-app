import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'

export default async (request: Request, _context: Context) => {
  console.log('[deleteWorkflow] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })
  if (retrievePrivateMetadataResult.success === false) {
    console.log('[deleteWorkflow] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  try {
    const requestBody = await request.json()
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', process.env.N8N_SECRET || '')

    const url = `${process.env.N8N_WEBHOOK_URL}/remove-workflow`
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
        n8nMainWorkflowId: retrievePrivateMetadataResult.data.n8nMainWorkflowId,
        workflowId: requestBody.workflowId,
      }),
    })

    if (!result.ok) {
      console.log('[deleteWorkflow] Failed to call N8N', result.statusText)
      return Response.json({ error: result.statusText, url }, { status: result.status })
    }

    return Response.json({}, { status: 200 })
  } catch (error) {
    console.log('[deleteWorkflow] Failed', error)
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
