import { apiDelete, apiGet, apiPost, apiPut } from './fetch.ts'

const createApi = () => {
  return {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete,
  }
}

export default createApi()
