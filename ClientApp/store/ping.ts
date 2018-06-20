import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface PingState {
    ping: number;
}

interface RequestPingAction {
    type: 'REQUEST_PING';
}

interface ReceivePingAction {
    type: 'RECEIVE_PING';
    ping: number;
}

type KnownAction = RequestPingAction | ReceivePingAction;


export const actionCreators = {
    ping: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch('/api/ping/pong', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_PING', ping: data });
                if (data == 0) {
                    window.location.reload();
                }
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_PING' });
    },
};

const unloadedState: PingState = { ping: 1 };

export const reducer: Reducer<PingState> = (state: PingState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PING':
            return {
                ping: state.ping,
            };
        case 'RECEIVE_PING':
            return {
                ping: action.ping,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};