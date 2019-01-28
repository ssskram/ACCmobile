
// hydrates the wholeeeeee store

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from '../../store/types'
import * as user from '../../store/user'
import * as incidents from '../../store/incidents'

type props = {
    incidents: types.incidents
    loadUser: () => void
    getIncidents: () => void
}

class Hydrate extends React.Component<props, {}> {

    componentDidMount() {
        this.props.loadUser()
        this.props.getIncidents()
    }

    public render() {
        return null
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user,
        ...state.incidents
    }),
    ({
        ...user.actionCreators,
        ...incidents.actionCreators
    })
)(Hydrate as any)