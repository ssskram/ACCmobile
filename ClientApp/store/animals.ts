import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface AnimalsState {
    animals: Animals[]
}

export interface Animals {
    oid: any;
    building: any;
    location: any;
    description: any;
    submitted: any;
    status: any;
    issue: any;
}

interface AnimalsRequestsAction {
    type: 'REQUEST_ANIMALS';
}

interface AnimalsReceiveAction {
    type: 'RECEIVE_ANIMALS';
    animals: Animals[];
}

type KnownAction = AnimalsRequestsAction | AnimalsReceiveAction;

export const actionCreators = {
    getAnimals: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch('/api/animals/all', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<Animals[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ANIMALS', animals: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_ANIMALS' });
    },
};

const unloadedState: AnimalsState = { animals: [] };

export const reducer: Reducer<AnimalsState> = (state: AnimalsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ANIMALS':
            return {
                animals: state.animals,
            };
        case 'RECEIVE_ANIMALS':
            return {
                animals: action.animals,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
