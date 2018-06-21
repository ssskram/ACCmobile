import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import Address from './Address'
import Incident from './Incident'
import Animals from './Animal'

export class Submit extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // load dropdown data
    }

    public render() {
        return (
            <div>
                <Address />

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
)(Submit as any) as typeof Submit;