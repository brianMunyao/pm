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
const memberAdded = (user, project_id) => ({
    type: actions.MEMBER_ADDED,
    payload: { user, project_id },
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

export const resetStore = () => (dispatch) => {
    dispatch({ type: 'RESET' });
};

// actions
export const fetchData = (id) => async(dispatch) => {
    const { data } = await axios.get(proxy(`/projects/myprojects/${id}`));
    if (data.data) {
        const arr = data.data.map((d) => d._id);
        const t = await axios.get(
            proxy(`/task/mytasks/${JSON.stringify(arr)}`)
        );

        dispatch(
            dataFetched({
                projects: data.data,
                tasks: t.data.data,
            })
        );
    }
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

export const openProject = (id) => async(dispatch) => {
    const { data } = await axios.get(proxy(`/chats/${id}`));
    dispatch(dataFetched({ chats: data.data }));
    dispatch(projectOpened(id));
    dispatch(navLocked());
};
export const closeProject = () => (dispatch) => {
    dispatch(dataFetched({ chats: [] }));
    dispatch(projectClosed());
    dispatch(navUnlocked());
};

export const addProject = (payload) => async(dispatch) => {
    const { data } = await axios.post(proxy('/projects/add'), payload);
    console.log(payload);

    if (data.data) {
        dispatch(projectAdded(data.data));
    } else {
        console.log(data);
    }
};
export const updateProject = (id, payload) => async(dispatch) => {
    await axios
        .put(proxy(`/projects/${id}`), payload)
        .then(({ data }) => {
            if (data.data) {
                dispatch(projectUpdated(data.data));
            } else {
                console.log(data);
            }
        })
        .catch((err) => console.log(err));
};
export const getUserByID = async(id) => {
    const { data } = await axios.get(
        `http://localhost:3001/users/userID/${id}`
    );

    if (data.data) {
        return data.data.fullname;
    } else {
        return id;
    }
};
export const deleteProject = (id) => async(dispatch) => {
    const { data } = await axios.delete(proxy(`/projects/${id}`));

    if (data.data) {
        dispatch(projectDeleted(id));
    } else {
        console.log(data);
    }
};

export const addTask = (payload) => async(dispatch) => {
    await axios
        .post(proxy(`/task/add`), payload)
        .then(({ data }) => {
            if (data.data) {
                dispatch(taskAdded(data.data));
            } else {
                console.log(data);
            }
        })
        .catch((err) => console.log(err));
};
export const updateTask = (id, payload) => async(dispatch) => {
    await axios
        .put(proxy(`/task/${id}`), payload)
        .then(({ data }) => {
            if (data.data) {
                dispatch(taskUpdated(data.data));
            } else {
                console.log(data);
            }
        })
        .catch((err) => console.log(err));
};
export const deleteTask = (id) => async(dispatch) => {
    await axios
        .delete(proxy(`/task/${id}`))
        .then(({ data }) => {
            if (data.data) {
                dispatch(taskDeleted(id));
            } else {
                console.log(data);
            }
        })
        .catch((err) => console.log(err));
    dispatch(taskDeleted(id));
};

export const sendMsg = (payload) => async(dispatch) => {
    await axios
        .post(proxy(`/chats/add`), payload)
        .then(({ data }) => {
            if (data.data) {
                dispatch(msgSent(data.data));
            } else {
                console.log(data);
            }
        })
        .catch((err) => console.log(err));
};

export const updateChats = (id) => async(dispatch) => {};

export const loginUser = async(user) => {
    try {
        const { data } = await axios.post(proxy('/users/login'), user);
        return data;
    } catch (err) {
        return { error: 'Invalid username or password' };
    }
};

export const signUpUser = async(user) => {
    const { data } = await axios.post(proxy('/users/register'), user);

    return data;
};