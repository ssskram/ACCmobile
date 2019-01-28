import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.incidents = {
    incidents: []
}

export const actionCreators = {
    getIncidents: (): AppThunkAction<any> => (dispatch) => {
        fetch("https://365proxy.azurewebsites.us/accmobile/allIncidents", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: constants.getIncidents, incidents: data })
            })
    }
}

export const reducer: Reducer<types.incidents> = (state: types.incidents, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.getIncidents:
            return { ...state, incidents: action.incidents }
    }

    return state || unloadedState
}