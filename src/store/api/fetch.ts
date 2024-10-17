import { v4 } from 'uuid'
import EnvVars from '@/services/EnvVars.ts'
import { StoreError, StoreErrorHandler } from '@/types.ts'
import { z } from 'zod'

interface IApiGet {
  path: string
  setEtag?: (etag: string) => void
  onError: StoreErrorHandler
  token?: string
}

interface IApiPutPost {
  path: string
  data: unknown
  onError: StoreErrorHandler
  etag?: string
  setEtag?: (etag: string) => void
  token?: string
}

interface IApiDelete {
  path: string
  etag: string
  onError: StoreErrorHandler
  setEtag?: (etag: string) => void
  token?: string
}

export const missingTokenError: StoreError = {
  type: 'authentication-error',
  title: 'Unauthorized',
  detail: 'No authentication token was provided.',
}

const apiErrorSchema = z.object({
  status: z.number(),
  type: z.string(),
  title: z.string(),
  detail: z.string(),
  invalidParameter: z.record(z.string(), z.any()).optional(),
})

export const convertApiToStoreError = (error: unknown): StoreError => {
  const parsedError = apiErrorSchema.safeParse(error)

  if (!parsedError.success) {
    const errorMessage = JSON.stringify(error)

    return {
      type: 'unknown',
      title: 'Unknown',
      detail: errorMessage || '',
    }
  }

  if (
    parsedError.data.type === 'validation-error' &&
    parsedError.data.status === 422 &&
    parsedError.data.invalidParameter &&
    parsedError.data.invalidParameter['if-match']
  ) {
    return {
      type: 'version-error',
      title: 'Data consistency conflict',
      detail: 'You are trying to update an outdated version of the data.',
    }
  }

  return {
    type: parsedError.data.type,
    title: parsedError.data.title,
    detail: parsedError.data.detail,
  }
}

export const apiGet = async <T>({ path, setEtag, onError, token }: IApiGet): Promise<T | false> => {
  return fetch(`${EnvVars.apiBaseUrl}${path}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const json = await res.json()
      return {
        etag: res.headers.get('etag'),
        json: json,
        status: res.status,
      }
    })
    .then((res) => {
      // we expect always content on reading - so we treat everything else then 200 as error
      if (res.status !== 200) {
        onError(() => {}, convertApiToStoreError(res.json))
        return false
      }

      if (setEtag) {
        setEtag(res.etag || '')
      }

      return res.json as unknown as T
    })
    .catch((error) => {
      onError(() => {}, convertApiToStoreError(error))
      return false
    })
}

export const apiPost = async <T>({
  path,
  data,
  etag,
  setEtag,
  onError,
  token,
}: IApiPutPost): Promise<T | false> => {
  return fetch(`${EnvVars.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'idempotency-key': v4(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'if-match': `${etag || ''}`,
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const json = res.status !== 204 ? await res.json() : null
      return {
        etag: res.headers.get('etag'),
        json,
        status: res.status,
      }
    })
    .then((res) => {
      if (![200, 201, 204].includes(res.status)) {
        onError(() => {}, convertApiToStoreError(res.json))
        return false
      }

      if (setEtag) {
        setEtag(res.etag || '')
      }

      return res.json as unknown as T
    })
    .catch((error) => {
      onError(() => {}, convertApiToStoreError(error))
      return false
    })
}

export const apiPut = async <T>({
  path,
  data,
  etag,
  setEtag,
  onError,
  token,
}: IApiPutPost): Promise<T | false> => {
  return fetch(`${EnvVars.apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'idempotency-key': v4(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'if-match': `W/"${etag || ''}"`,
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const json = await res.json()
      return {
        etag: res.headers.get('etag'),
        json: json,
        status: res.status,
      }
    })
    .then((res) => {
      if (![200, 201, 204].includes(res.status)) {
        onError(() => {}, convertApiToStoreError(res.json))
        return false
      }

      if (setEtag) {
        setEtag(res.etag || '')
      }

      return res.json as unknown as T
    })
    .catch((error) => {
      onError(() => {}, convertApiToStoreError(error))
      return false
    })
}

export const apiDelete = async <T>({
  path,
  etag,
  setEtag,
  onError,
  token,
}: IApiDelete): Promise<T | false> => {
  return fetch(`${EnvVars.apiBaseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'idempotency-key': v4(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'if-match': `${etag}`,
    },
  })
    .then(async (res) => {
      const json = res.status === 204 ? null : await res.json()
      return {
        etag: res.headers.get('etag'),
        json,
        status: res.status,
      }
    })
    .then((res) => {
      if (res.status !== 204) {
        onError(() => {}, convertApiToStoreError(res.json))
        return false
      }

      if (setEtag) {
        setEtag(res.etag || '')
      }

      return res.json as unknown as T
    })
    .catch((error) => {
      onError(() => {}, convertApiToStoreError(error))
      return false
    })
}
