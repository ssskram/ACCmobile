import * as Messages from './messages';
import * as Ping from './ping';
import * as User from './user';
import * as Animals from './animals'
import * as Incidents from './incidents'
import * as Dropdowns from './dropdowns'
import { combineReducers } from 'redux';

export interface ApplicationState {
    animals: Animals.AnimalsState;
    incidents: Incidents.IncidentsState;
    dropdowns: Dropdowns.DropdownState;
    user: User.UserState;
    ping: Ping.PingState;
    messages: Messages.MessageState;
}
export const reducers = {
    animals: Animals.reducer,
    incidents: Incidents.reducer,
    dropdowns: Dropdowns.reducer,
    user: User.reducer,
    ping: Ping.reducer,
    messages: Messages.reducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
