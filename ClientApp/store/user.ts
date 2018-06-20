import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface UserState {
    user: string
}

interface RequestUserAction {
    type: 'REQUEST_USER';
}

interface ReceiveUserAction {
    type: 'RECEIVE_USER';
    user: string;
}

type KnownAction = RequestUserAction | ReceiveUserAction;


export const actionCreators = {
    requestUser: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch('/api/userdata/getuser', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_USER', user: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_USER' });
    }
};

export const reducer: Reducer<UserState> = (state: UserState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_USER':
            return {
                user: state.user,
            };
        case 'RECEIVE_USER':
            return {
                user: action.user,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { user: "...loading your account" }
};