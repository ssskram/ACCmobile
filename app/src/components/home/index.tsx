import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from '../../store/types'
import * as messages from '../../store/messages'
import * as incidents from '../../store/incidents'
import * as dropdowns from '../../store/dropdowns'
import HydrateStore from '../utilities/hydrateStore'
import Messages from '../utilities/messages'
import AllIncidents from '../incidents'

type props = {
    incidents: types.incident[]
    dropdowns: types.dropdowns
}

export class Home extends React.Component<props, {}> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    render() {
        return (
            <div>
                <HydrateStore />
                <Messages />
                <AllIncidents
                    dropdowns={this.props.dropdowns}
                    incidents={this.props.incidents}
                />
            </div>
        )
    }
}


export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
        ...state.incidents,
        ...state.dropdowns
    }),
    ({
        ...messages.actionCreators,
        ...incidents.actionCreators,
        ...dropdowns.actionCreators
    })
)(Home as any)