import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.messsage = {
    message: ''
}

export const actionCreators = {
    newMessage: (message): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.newMessage, message })
    },
    successMessage: (): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.success })
    },
    errorMessage: (): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.failure })
    },
    clearMessage: (): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.clear })
    }
}

export const reducer: Reducer<types.messsage> = (state: types.messsage, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.success:
            return { ...state, message: "Success!" }
        case constants.failure:
            return { ...state, message: "Ooops!<br/>That didn't work<br/>Please logout, log back in, and try again" }
        case constants.clear:
            return { ...state, message: '' }
        case constants.newMessage:
            return { ...state, message: action.message }
    }
    return state || unloadedState
}