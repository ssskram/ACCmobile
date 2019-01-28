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
    },
    newIncident: (incident): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.newIncident, incident: incident })
    },
    updateIncident: (incident): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.updateIncident, incident: incident })
    }
}

export const reducer: Reducer<types.incidents> = (state: types.incidents, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.getIncidents:
            return { ...state, incidents: action.incidents }
        case constants.newIncident:
            return { ...state, incidents: state.incidents.concat(action.incident) }
        // add update incident here
    }

    return state || unloadedState
}