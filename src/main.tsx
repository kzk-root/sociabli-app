import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import log from 'loglevel'
import EnvVars from '@/services/EnvVars.ts'

log.setLevel(EnvVars.logLevel)
log.debug('Starting app')

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
