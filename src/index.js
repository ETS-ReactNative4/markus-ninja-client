import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {ReactRouterGlobalHistory} from 'react-router-global-history';
import {UIDProvider} from 'components/UniqueId';
import 'styles/index.css';
import App from 'containers/App';
import registerServiceWorker from './serviceWorker';

import WebFontLoader from 'webfontloader';

const history = createBrowserHistory()

WebFontLoader.load({
  google: {
    families: [
      'Roboto:300,400,500,700',
      'Arima Madurai:300,400,500,700',
      'Mali:300,400,500,700',
    ],
  },
})

ReactDOM.render(
  <BrowserRouter history={history}>
    <UIDProvider>
      <ReactRouterGlobalHistory />
      <App />
    </UIDProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
registerServiceWorker();
