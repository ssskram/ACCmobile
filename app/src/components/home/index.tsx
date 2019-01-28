import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from '../../store/types'
import * as messages from '../../store/messages'
import * as incidents from '../../store/incidents'
import HydrateStore from '../utilities/hydrateStore'
import Messages from '../utilities/messages'
import AllIncidents from '../incidents'

type props = {
    incidents: types.incident[]
}

export class Home extends React.Component<props, {}> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    render() {
        return (
            <div className='text-center'>
                <HydrateStore />
                <Messages />
                <AllIncidents incidents={this.props.incidents}/>
            </div>
        )
    }
}


export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
        ...state.incidents
    }),
    ({
        ...messages.actionCreators,
        ...incidents.actionCreators
    })
)(Home as any)