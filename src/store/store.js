import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { projects, tasks } from '../apis/data'; //!CHANGE THIS
import rootReducer from './rootReducer';

const initialState = {
    openedProject: null,
    pModal: false,
    pEdit: null,
    navMini: false,
    tasks: [...tasks],
    projects: [...projects],
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