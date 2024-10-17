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

export const ShowToast = (title = 'Fehler', text = 'Anfrage fehlgeschlagen') => {
  console.log('show toast')
  toast.error(<ToastMessage title={title} text={text} />, {
    position: 'bottom-right',
    data: { key: 'value' },
  })
}
