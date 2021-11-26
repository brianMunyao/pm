import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { chats, projects, tasks } from '../apis/data'; //!CHANGE THIS
import rootReducer from './rootReducer';

const initialState = {
    openedProject: null,
    pModal: false,
    tModal: false,
    pEdit: null,
    navMini: false,
    navLock: false,
    tasks: [...tasks],
    projects: [...projects],
    chats: [...chats],
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