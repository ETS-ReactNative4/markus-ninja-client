import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { UIDProvider } from 'components/UniqueId';
import 'styles/index.css';
import App from 'containers/App';
import AuthProvider from 'containers/AuthProvider'
import registerServiceWorker from './registerServiceWorker';

import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700'],
  },
})

ReactDOM.render(
  <BrowserRouter>
    <UIDProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UIDProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
registerServiceWorker();
