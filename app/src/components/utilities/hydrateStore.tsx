
// hydrates the wholeeeeee store

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from '../../store/types'
import * as user from '../../store/user'
import * as incidents from '../../store/incidents'
import * as dropdowns from '../../store/dropdowns'

type props = {
    incidents: types.incidents
    dropdowns: types.dropdowns
    loadUser: () => void
    getIncidents: () => void
    getDropdowns: () => void
}

class Hydrate extends React.Component<props, {}> {

    componentDidMount() {
        this.props.loadUser()
        this.props.getIncidents()
        this.props.getDropdowns()
    }

    public render() {
        return null
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user,
        ...state.incidents,
        ...state.dropdowns
    }),
    ({
        ...user.actionCreators,
        ...incidents.actionCreators,
        ...dropdowns.actionCreators
    })
)(Hydrate as any)