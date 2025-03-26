import { toast } from 'react-toastify'
import log from 'loglevel'
import React from 'react'

interface ToastMessageProps {
  title: string
  text: string
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ title, text }) => {
  return (
    <div className="msg-container">
      <strong className="msg-title">{title}</strong>
      <p className="msg-description">{text}</p>
    </div>
  )
}

export const ShowErrorToast = (title = 'Error', text = 'Request failed') => {
  log.debug('[Toast] Error', { title, text })
  toast.error(<ToastMessage title={title} text={text} />, {
    data: { key: 'value' },
  })
}

export const ShowSuccessToast = (title = 'Success', text = 'Request success') => {
  log.debug('[Toast] Success', { title, text })
  toast.success(<ToastMessage title={title} text={text} />, {
    data: { key: 'value' },
  })
}

export const ShowInfoToast = (title = 'Okay', text = 'Request succeed') => {
  log.debug('[Toast] Info', { title, text })
  toast.info(<ToastMessage title={title} text={text} />, {
    data: { key: 'value' },
  })
}
