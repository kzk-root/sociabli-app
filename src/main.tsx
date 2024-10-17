import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import log from 'loglevel'
import { StoreProvider } from 'easy-peasy'
import store from '@/store'

// FIXME set based on env var
log.setLevel('debug')
log.debug('Starting app')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
)
