import {createStore, compose, applyMiddleware} from 'redux';
import reducer from './reducer.ts';
import thunk from 'redux-thunk';

let composeEnhancers = compose;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;
