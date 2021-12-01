import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

const initialState = {
    appLoaded: false,
    openedProject: null,
    pModal: false,
    tModal: false,
    pEdit: null,
    navMini: false,
    navLock: false,
    tasks: [],
    projects: [],
    chats: [],
};

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;