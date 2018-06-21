import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface DropdownState {
    animalTypes: AnimalTypes[]
    animalCoats: AnimalCoats[]
    veterinarians: Veterinarians[]
    reasonsForVisit: ReasonsForVisit[]
    callOrigins: CallOrigins[]
    officerInitials: OfficerInitials[]
    citationNumbers: CitationNumbers[]
}
export interface AnimalTypes {
    type: any;
}
export interface AnimalCoats {
    coat: any;
}
export interface Veterinarians {
    vets: any;
}
export interface ReasonsForVisit {
    reason: any;
}
export interface CallOrigins {
    origin: any;
}
export interface OfficerInitials {
    initials: any;
}
export interface CitationNumbers {
    number: any;
}

interface DropdownRequestsAction {
    type: 'REQUEST_DROPDOWNS';
}
interface AnimalTypesReceiveAction {
    type: 'RECEIVE_ANIMALTYPES';
    animalTypes: AnimalTypes[]
}
interface AnimalCoatsReceiveAction {
    type: 'RECEIVE_ANIMALCOATS';
    animalCoats: AnimalCoats[]
}
interface VeterinariansReceiveAction {
    type: 'RECEIVE_VETERINARIANS';
    vets: Veterinarians[]
}
interface ReasonsForVisitReceiveAction {
    type: 'RECEIVE_REASONSFORVISIT';
    reasons: ReasonsForVisit[]
}
interface CallOriginsReceiveAction {
    type: 'RECEIVE_CALLORIGINS';
    callOrigins: CallOrigins[]
}
interface OfficerInitialsReceiveAction {
    type: 'RECEIVE_OFFICERINITIALS';
    initials: OfficerInitials[]
}
interface CitationNumbersReceiveAction {
    type: 'RECEIVE_CITATIONNUMBERS';
    numbers: CitationNumbers[]
}

type KnownAction =
    DropdownRequestsAction |
    AnimalTypesReceiveAction |
    AnimalCoatsReceiveAction |
    VeterinariansReceiveAction |
    ReasonsForVisitReceiveAction |
    CallOriginsReceiveAction |
    OfficerInitialsReceiveAction |
    CitationNumbersReceiveAction

export const actionCreators = {
    getDropdowns: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchAnimalTypes = fetch('/api/dropdowns/animalTypes', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<AnimalTypes[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ANIMALTYPES', animalTypes: data });
            });

        let fetchAnimalCoats = fetch('/api/dropdowns/animalCoats', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<AnimalCoats[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ANIMALCOATS', animalCoats: data });
            });

        let fetchVeterinarians = fetch('/api/dropdowns/vets', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<Veterinarians[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_VETERINARIANS', vets: data });
            });

        let fetchReasonsForVisit = fetch('/api/dropdowns/reasonsForVisit', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<ReasonsForVisit[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_REASONSFORVISIT', reasons: data });
            });

        let fetchCallOrigins = fetch('/api/dropdowns/callOrigins', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<CallOrigins[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_CALLORIGINS', callOrigins: data });
            });

        let fetchOfficerInitials = fetch('/api/dropdowns/officerInitials', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<OfficerInitials[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_OFFICERINITIALS', initials: data });
            });

        let fetchCitationNumbers = fetch('/api/dropdowns/citationNumbers', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<CitationNumbers[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_CITATIONNUMBERS', numbers: data });
            });

        addTask(fetchAnimalTypes);
        addTask(fetchAnimalCoats);
        addTask(fetchVeterinarians);
        addTask(fetchReasonsForVisit);
        addTask(fetchCallOrigins);
        addTask(fetchOfficerInitials);
        addTask(fetchCitationNumbers);
        dispatch({ type: 'REQUEST_DROPDOWNS' });
    },
};

const unloadedState: DropdownState = {
    animalTypes: [],
    animalCoats: [],
    veterinarians: [],
    reasonsForVisit: [],
    callOrigins: [],
    officerInitials: [],
    citationNumbers: []
};

export const reducer: Reducer<DropdownState> = (state: DropdownState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_DROPDOWNS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_ANIMALTYPES':
            return {
                animalTypes: action.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_ANIMALCOATS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: action.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_VETERINARIANS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: action.vets,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_REASONSFORVISIT':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: action.reasons,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_CALLORIGINS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: action.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_OFFICERINITIALS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: action.initials,
                citationNumbers: state.citationNumbers
            };
        case 'RECEIVE_CITATIONNUMBERS':
            return {
                animalTypes: state.animalTypes,
                animalCoats: state.animalCoats,
                veterinarians: state.veterinarians,
                reasonsForVisit: state.reasonsForVisit,
                callOrigins: state.callOrigins,
                officerInitials: state.officerInitials,
                citationNumbers: action.numbers
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
