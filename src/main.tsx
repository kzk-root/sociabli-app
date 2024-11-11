import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import log from 'loglevel'

// FIXME set based on env var
log.setLevel('debug')
log.debug('Starting app')

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
