import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './app';

import './index.scss';
import registerServiceWorker from './registerServiceWorker';

import store from './store.js';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
