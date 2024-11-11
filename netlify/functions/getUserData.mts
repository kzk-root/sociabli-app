import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'

export default async (request: Request): Promise<Response> => {
  console.log('[getUserData] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log('[getUserData] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  return Response.json(retrievePrivateMetadataResult.data.mainWebhook)
}
