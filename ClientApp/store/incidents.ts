import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface IncidentsState {
    electronicIncidents: Incidents[]
    analogIncidents: Incidents[]
}
export interface Incidents {
    oid: any;
    building: any;
    location: any;
    description: any;
    submitted: any;
    status: any;
    issue: any;
}

interface IncidentsRequestsAction {
    type: 'REQUEST_INCIDENTS';
}
interface ElectronicIncidentsReceiveAction {
    type: 'RECEIVE_ELECTRONICINCIDENTS';
    electronicIncidents: Incidents[];
}
interface AnalogIncidentsReceiveAction {
    type: 'RECEIVE_ANALOGINCIDENTS';
    analogIncidents: Incidents[];
}

type KnownAction =
    IncidentsRequestsAction |
    ElectronicIncidentsReceiveAction |
    AnalogIncidentsReceiveAction

export const actionCreators = {
    getIncidents: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchElectronicIncidents = fetch('/api/incidents/electronic', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<Incidents[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ELECTRONICINCIDENTS', electronicIncidents: data });
            });

        let fetchAnalogIncidents = fetch('/api/incidents/analog', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<Incidents[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ANALOGINCIDENTS', analogIncidents: data });
            });

        addTask(fetchElectronicIncidents);
        addTask(fetchAnalogIncidents);
        dispatch({ type: 'REQUEST_INCIDENTS' });
    },
};

const unloadedState: IncidentsState = {
    electronicIncidents: [],
    analogIncidents: []
};

export const reducer: Reducer<IncidentsState> = (state: IncidentsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_INCIDENTS':
            return {
                electronicIncidents: state.electronicIncidents,
                analogIncidents: state.analogIncidents
            };
        case 'RECEIVE_ELECTRONICINCIDENTS':
            return {
                electronicIncidents: action.electronicIncidents,
                analogIncidents: state.analogIncidents
            };
        case 'RECEIVE_ANALOGINCIDENTS':
            return {
                electronicIncidents: state.electronicIncidents,
                analogIncidents: action.analogIncidents
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
