import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'

export default async (request: Request): Promise<Response> => {
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (!retrievePrivateMetadataResult.success) {
    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  return Response.json(retrievePrivateMetadataResult.data.mainWebhook)
}
