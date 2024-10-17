import { createStore, persist } from 'easy-peasy'
import model, { StoreModel } from '@/store/model'
import createApi from '@/store/api'

export interface Injections {
  api: typeof createApi
}

const store = createStore<StoreModel>(persist(model), {
  injections: {
    api: createApi,
  },
  devTools: process.env.NODE_ENV === 'development',
})

export default store
