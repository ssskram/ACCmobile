import * as user from './user'
import * as types from './types'
import * as messages from './messages'
import * as incidents from './incidents'
import * as dropdowns from './dropdowns'

export interface ApplicationState {
    user: types.user,
    messages: types.messsage,
    incidents: types.incidents,
    dropdowns: types.dropdowns
}

export const reducers = {
    user: user.reducer,
    messages: messages.reducer,
    incidents: incidents.reducer,
    dropdowns: dropdowns.reducer
}

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}