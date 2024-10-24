import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'

const API_ENDPOINT = 'https://smoggy-rosabelle-konzentrik-754b049a.koyeb.app/api/v1'

type Workflow = {
  id: string
  name: string
}
export default async (request: Request, _context: Context) => {
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if(!retrievePrivateMetadataResult.success) {
    return Response.json({ message: retrievePrivateMetadataResult.error.message }, { status: retrievePrivateMetadataResult.error.statusCode })
  }

  try {
    const customHeaders = new Headers()
    customHeaders.set('X-N8N-API-KEY', retrievePrivateMetadataResult.data.n8nApiKey)

    const response = await fetch(API_ENDPOINT + '/workflows', {
        method: "GET",
        headers: customHeaders,
    })

    const data = await response.json()
    const workflowList: Workflow[] = []

    data.data.forEach((workflow: any) => {
      if (!workflow.tags.find((child: any) => child.name === 'hideInUi')) {
        workflowList.push({
          id: workflow.id,
          name: workflow.name.replace(` - ${retrievePrivateMetadataResult.data.userId}`, ''),
        })
      }
    })

    return Response.json(workflowList)
  } catch (error) {
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }

}
