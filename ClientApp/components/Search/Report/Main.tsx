import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../store';
import * as Ping from '../../../store/ping';
import Incident from './Incident'
import Animals from './Animals'

export class Report extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // pull specific incident from store
        // get animals corresponding to incident
    }

    public render() {
        return (
            <div>
                <Incident />

                <Animals />
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(Report as any) as typeof Report;