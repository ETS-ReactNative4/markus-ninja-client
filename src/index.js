import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { UIDProvider } from 'components/UniqueId'
import './styles/index.css'
import App from 'containers/App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <BrowserRouter>
    <UIDProvider>
      <App />
    </UIDProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
registerServiceWorker()
