import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
import logger from '../logger';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(
    applyMiddleware(thunk, )//logger
));
/*const store = createStore(reducers, applyMiddleware(logger, thunk),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
*/

export default store;