import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'

const N8N_ACTIVATE_WEBHOOK_ENDPOINT = 'https://smoggy-rosabelle-konzentrik-754b049a.koyeb.app/webhook-test/13ff4a5c-1da0-4702-98c5-eafae350bece'

export default async (request: Request, _context: Context) => {
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if(!retrievePrivateMetadataResult.success) {
    return Response.json({ message: retrievePrivateMetadataResult.error.message }, { status: retrievePrivateMetadataResult.error.statusCode })
  }

  try {
    // Call N8N - Crossposter with "data"
    // N8N Steps
    // Trigger on Webhook, receiving "data"
    // Create Credentials for Medium with n8n-api-key of user
    // Create Medium workflow with n8n-api-key of user
    // Extend Main Workflow with Medium Workflow
    //   - look up all user workflows and filter out Main Workflow
    //   - add new Medium Workflow to be triggered in Main Workflow

    // TODO: get fields from request

    await fetch(N8N_ACTIVATE_WEBHOOK_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
        workflowId: 'blog_to_medium',
        fields: [
          {id: 'mediumAccessToken', value:"some_token"},
        ],
      }),
    })

    return Response.json({}, {status: 200})
  } catch (error) {
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
