
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState = {
    dropdowns: {
        animalBreeds: [],
        animalCoats: [],
        veterinarians: [],
        reasonsForVisit: [],
        callOrigins: [],
        officerInitials: [],
        citationNumbers: []
    }
}

export const actionCreators = {
    getDropdowns: (): AppThunkAction<any> => async (dispatch, getState) => {
        let allDropdowns: types.dropdowns = {
            animalBreeds: [],
            animalCoats: [],
            veterinarians: [],
            reasonsForVisit: [],
            callOrigins: [],
            officerInitials: [],
            citationNumbers: [],
        }

        const animalBreeds = await fetch("https://365proxy.azurewebsites.us/accmobile/animalBreeds", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.animalBreeds = data)

        const animalCoats = await fetch("https://365proxy.azurewebsites.us/accmobile/animalCoats", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.animalCoats = data)

        const vets = await fetch("https://365proxy.azurewebsites.us/accmobile/vets", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.veterinarians = data)

        const reasonsForVisit = await fetch("https://365proxy.azurewebsites.us/accmobile/reasonsForVisit", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.reasonsForVisit = data)

        const callOrigins = await fetch("https://365proxy.azurewebsites.us/accmobile/callOrigins", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.callOrigins = data)

        const citationNumbers = await fetch("https://365proxy.azurewebsites.us/accmobile/citationNumbers", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.citationNumbers = data)

        const officerInitials = await fetch("https://365proxy.azurewebsites.us/accmobile/officerInitials", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => allDropdowns.officerInitials = data)

        animalBreeds
        animalCoats
        vets
        reasonsForVisit
        callOrigins
        officerInitials
        citationNumbers
        dispatch({ type: constants.getDropdowns, dropdowns: allDropdowns })
    }
}

export const reducer: Reducer<any> = (state: any, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.getDropdowns:
            return { ...state, dropdowns: action.dropdowns }
    }
    return state || unloadedState
}