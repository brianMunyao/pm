import * as actions from './actionsTypes';
const rootReducer = (state = {}, action) => {
    switch (action.type) {
        case actions.USER_LOGIN:
            return {...state };

        case actions.USER_SIGNUP:
            return {...state };

        case actions.NAV_MINI:
            return {...state, navMini: true };
        case actions.NAV_MAX:
            return {...state, navMini: false };
        case actions.NAV_LOCK:
            return {...state, navLock: true, navMini: true };
        case actions.NAV_UNLOCK:
            return {...state, navLock: false };

        case actions.P_MODAL_OPENED:
            return {...state, pModal: true };
        case actions.P_MODAL_CLOSED:
            return {...state, pModal: false };
        case actions.T_MODAL_OPENED:
            return {...state, tModal: true };
        case actions.T_MODAL_CLOSED:
            return {...state, tModal: false };

        case actions.P_EDIT_OPENED:
            return {...state, pEdit: action.payload };
        case actions.P_EDIT_CLOSED:
            return {...state, pEdit: null };

        case actions.PROJECT_OPENED:
            return {...state, openedProject: action.payload };
        case actions.PROJECT_CLOSED:
            return {...state, openedProject: null };

        case actions.PROJECT_CREATED:
            return {
                ...state,
                projects: [
                    ...state.projects,
                    {...action.payload, id: state.projects.length + 1 }, //!CHANGE THIS TO GET ID FROM DB
                ],
            };
        case actions.PROJECT_UPDATED:
            return {
                ...state,
                projects: [
                    ...state.projects.map((p) =>
                        p.id === action.payload.id ? action.payload : p
                    ),
                ],
            };
        case actions.PROJECT_DELETED:
            return {
                ...state,
                projects: state.projects.filter((p) => p.id !== action.payload),
            };

        case actions.TASK_CREATED:
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    {
                        ...action.payload,
                        assigned: null, //!CHANGE THIS TO GET ASSIGN IN DB
                        tags: [],
                        id: state.tasks.length + 1, //!CHANGE THIS TO GET ASSIGN IN DB
                        due_date: null,
                    },
                ],
            };
        case actions.TASK_UPDATED:
            return {
                ...state,
                tasks: [
                    ...state.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                    ),
                ],
            };
        case actions.TASK_DELETED:
            return {
                ...state,
                tasks: state.tasks.filter((t) => t.id !== action.payload),
            };
        case actions.MSG_SENT:
            return {
                ...state,
                chats: [
                    ...state.chats,
                    {...action.payload, id: state.chats.length + 1 },
                ], //!CHANGE THIS TO GET ASSIGN IN DB
            };

        default:
            return state;
    }
};

export default rootReducer;