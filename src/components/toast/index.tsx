import { toast } from 'react-toastify'
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

export const ShowToast = (title = 'Error', text = 'Request failed') => {
  console.log('show toast again')
  toast.error(<ToastMessage title={title} text={text} />, {
    theme: 'colored',
    data: { key: 'value' },
  })
}
