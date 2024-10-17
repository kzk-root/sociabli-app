export type StoreError = {
  type: string
  title: string
  detail: string
}

export type StoreErrorHandler = (action: () => void, error: StoreError) => void
