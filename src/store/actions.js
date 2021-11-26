import axios from 'axios';
import * as actions from './actionsTypes';

const proxy = (path) => `http://localhost:3001${path}`;

//action creators
const dataFetched = (payload) => ({ type: actions.DATA_FETCHED, payload });

const navMinimized = () => ({
    type: actions.NAV_MINI,
});
const navMaximized = () => ({
    type: actions.NAV_MAX,
});
const navLocked = () => ({
    type: actions.NAV_LOCK,
});
const navUnlocked = () => ({
    type: actions.NAV_UNLOCK,
});

const pModalOpened = () => ({
    type: actions.P_MODAL_OPENED,
});
const pModalClosed = () => ({
    type: actions.P_MODAL_CLOSED,
});
const tModalOpened = () => ({
    type: actions.T_MODAL_OPENED,
});
const tModalClosed = () => ({
    type: actions.T_MODAL_CLOSED,
});

const pEditOpened = (payload) => ({
    type: actions.P_EDIT_OPENED,
    payload,
});
const pEditClosed = () => ({
    type: actions.P_EDIT_CLOSED,
});

const projectOpened = (id) => ({
    type: actions.PROJECT_OPENED,
    payload: id,
});
const projectClosed = () => ({
    type: actions.PROJECT_CLOSED,
});

const projectAdded = (payload) => ({
    type: actions.PROJECT_CREATED,
    payload,
});
const projectUpdated = (payload) => ({
    type: actions.PROJECT_UPDATED,
    payload,
});
const projectDeleted = (id) => ({
    type: actions.PROJECT_DELETED,
    payload: id,
});

const taskAdded = (payload) => ({
    type: actions.TASK_CREATED,
    payload,
});
const taskUpdated = (payload) => ({
    type: actions.TASK_UPDATED,
    payload,
});
const taskDeleted = (id) => ({
    type: actions.TASK_DELETED,
    payload: id,
});

const msgSent = (payload) => ({
    type: actions.MSG_SENT,
    payload,
});

// const userSignedUp = (user) => ({
//     type: actions.USER_SIGNUP,
//     payload: user,
// });
// const userLoggedIn = (user) => ({
//     type: actions.USER_LOGIN,
//     payload: user,
// });

// actions
export const fetchData = () => async(dispatch) => {
    const { data } = await axios.get(proxy('/projects'));

    dispatch(
        dataFetched({
            projects: data.data,
        })
    );
};
export const minimizeNav = () => (dispatch) => {
    dispatch(navMinimized());
};
export const maximizeNav = () => (dispatch) => {
    dispatch(navMaximized());
};
export const lockNav = () => (dispatch) => {
    dispatch(navLocked());
};
export const unlockNav = () => (dispatch) => {
    dispatch(navUnlocked());
};

export const openPModal = () => (dispatch) => {
    dispatch(pModalOpened());
};
export const closePModal = () => (dispatch) => {
    dispatch(pModalClosed());
};
export const openTModal = () => (dispatch) => {
    dispatch(tModalOpened());
};
export const closeTModal = () => (dispatch) => {
    dispatch(tModalClosed());
};

export const openPEdit = (payload) => (dispatch) => {
    dispatch(pModalOpened());
    dispatch(pEditOpened(payload));
};
export const closePEdit = () => (dispatch) => {
    dispatch(pEditClosed());
};

export const openProject = (id) => (dispatch) => {
    dispatch(projectOpened(id));
    dispatch(navLocked());
};
export const closeProject = () => (dispatch) => {
    dispatch(projectClosed());
    dispatch(navUnlocked());
};

export const addProject = (payload) => async(dispatch) => {
    const { data } = await axios.post(proxy('/projects/add'), payload);

    if (data.data) {
        dispatch(projectAdded(data.data));
    } else {
        console.log(data);
    }
};
export const updateProject = (payload) => (dispatch) => {
    dispatch(projectUpdated(payload));
};
export const deleteProject = (id) => async(dispatch) => {
    const { data } = await axios.delete(proxy(`/projects/${id}`));

    if (data.data) {
        dispatch(projectDeleted(id));
    } else {
        console.log(data);
    }
};

export const addTask = (payload) => (dispatch) => {
    dispatch(taskAdded(payload));
};
export const updateTask = (payload) => (dispatch) => {
    dispatch(taskUpdated(payload));
};
export const deleteTask = (id) => (dispatch) => {
    dispatch(taskDeleted(id));
};

export const sendMsg = (payload) => (dispatch) => {
    dispatch(msgSent(payload));
};

export const loginUser = async(user) => {
    const { data } = await axios.post(proxy('/users/login'), user);

    return data;
};

export const signUpUser = async(user) => {
    const { data } = await axios.post(proxy('/users/register'), user);

    return data;
};