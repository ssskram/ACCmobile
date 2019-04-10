
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

        const dd = await fetch("https://365proxy-staging.azurewebsites.us/accmobile/dropdowns", {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(response => response.json())
            .then(data => {
                allDropdowns.animalBreeds = data.find(i => i.type == "animalBreeds").objects
                allDropdowns.animalCoats = data.find(i => i.type == "animalCoats").objects
                allDropdowns.veterinarians = data.find(i => i.type == "vets").objects
                allDropdowns.reasonsForVisit = data.find(i => i.type == "reasonsForVisit").objects
                allDropdowns.callOrigins = data.find(i => i.type == "callOrigins").objects
                allDropdowns.citationNumbers = data.find(i => i.type == "citationNumbers").objects
                allDropdowns.officerInitials = data.find(i => i.type == "officerInitials").objects
            })

        dd
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