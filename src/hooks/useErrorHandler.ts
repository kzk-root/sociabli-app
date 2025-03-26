import { useEffect, useState } from 'react'
import { StoreError } from '@/types.ts'
import { ShowErrorToast } from '@/components/toast'

type DialogProps = {
  visible: boolean
  action?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  SHOW_DIALOG: 'SHOW_DIALOG',
  HIDE_DIALOG: 'HIDE_DIALOG',
} as const

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['SHOW_DIALOG']
      dialog: DialogProps
    }
  | {
      type: ActionType['HIDE_DIALOG']
      dialog: DialogProps
    }

interface State {
  visible: boolean
  action?: () => void
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_DIALOG':
      return {
        ...state,
        visible: action.dialog.visible,
        action: action.dialog.action,
      }
    case 'HIDE_DIALOG':
      return {
        ...state,
        visible: action.dialog.visible,
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { visible: false }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function showVersionErrorDialog(action: () => void) {
  dispatch({
    type: 'SHOW_DIALOG',
    dialog: { visible: true, action },
  })
}

function hideVersionErrorDialog() {
  dispatch({
    type: 'HIDE_DIALOG',
    dialog: {
      visible: false,
    },
  })
}

function runAction() {
  if (memoryState.action) {
    memoryState.action()
    hideVersionErrorDialog()
  }
}

function handleError(action: () => void, error?: StoreError) {
  if (error?.type === 'version-error' || error?.type === 'wrong-expected-version') {
    showVersionErrorDialog(action)
    return
  }

  ShowErrorToast(error?.title, error?.detail)
}

export function useErrorHandler() {
  const [state, setState] = useState<State>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    handleError: handleError,
    hideVersionErrorDialog: hideVersionErrorDialog,
    runAction: runAction,
  }
}
