
import './polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//For Reducer
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

//For Saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { applyMiddleware } from 'redux';

//For Routing
import { BrowserRouter } from 'react-router-dom';

const sagaMiddleware    =   createSagaMiddleware();
const store             =   createStore(
                                reducer,
                                applyMiddleware(sagaMiddleware)
                            );
sagaMiddleware.run(rootSaga);

//const store     =   createStore(reducer);

ReactDOM.render(
                <Provider store={store}>    
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </Provider>,
                document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
