import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

export const initialState = {
    appLoaded: false,
    openedProject: null,
    pModal: false,
    tModal: false,
    pEdit: null,
    navMini: false,
    navLock: false,
    tasks: [],
    projects: [],
    chats: {},
    socket: null,
};

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk)
        // window.__REDUX_DEVTOOLS_EXTENSION__ &&
        // window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;