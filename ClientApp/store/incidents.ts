import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface IncidentsState {
    incidents: Incidents[]
}
export interface Incidents {
    uuid: any
    link: any;
    date: any;
    address: any;
    itemId: any;
    coords: any;
    reasonForVisit: any;
    note: any;
    ownersLastName: any;
    ownersFirstName: any;
    ownersTelephoneNumber: any;
    pghCode: any;
    citationNumber: any;
    comments: any;
    callOrigin: any;
    submittedBy: any;
    modifiedBy: any;
    officerInitials: any;
    open: any;
    zip: any;
}

interface IncidentsRequestsAction {
    type: 'REQUEST_INCIDENTS';
}
interface IncidentsReceiveAction {
    type: 'RECEIVE_INCIDENTS';
    incidents: Incidents[];
}

type KnownAction =
    IncidentsRequestsAction |
    IncidentsReceiveAction

export const actionCreators = {
    getIncidents: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchIncidents = fetch('/api/incidents/all', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<Incidents[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_INCIDENTS', incidents: data });
            });

        addTask(fetchIncidents);
        dispatch({ type: 'REQUEST_INCIDENTS' });
    },
};

const unloadedState: IncidentsState = {
    incidents: []
};

export const reducer: Reducer<IncidentsState> = (state: IncidentsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_INCIDENTS':
            return {
                incidents: state.incidents,
            };
        case 'RECEIVE_INCIDENTS':
            return {
                incidents: action.incidents,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
