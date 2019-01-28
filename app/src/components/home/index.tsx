import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as MessageStore from '../../store/messages'
import HydrateStore from '../utilities/hydrateStore'
import Messages from '../utilities/messages'

export class Home extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    render() {
        return (
            <div className='text-center'>
                <HydrateStore />
                <Messages />
                Testing first build deployment
            </div>
        )
    }
}


export default connect(
    (state: ApplicationState) => ({
        ...state.messages
    }),
    ({
        ...MessageStore.actionCreators,
    })
)(Home)