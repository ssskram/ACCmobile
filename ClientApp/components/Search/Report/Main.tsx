import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../store';
import * as Ping from '../../../store/ping';
import Incident from './Incident'
import Animals from './Animals'

export class Report extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            state: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        const cachedState = localStorage.getItem('acc_state');

        if (cachedState) {
          this.setState({ state: JSON.parse(cachedState) });
          return;
        }
        
        // pull specific incident from store
        // get animals corresponding to incident
    }

    public render() {
        const { link } = this.props.match.params
        // var redirect = link.startsWith("http")

        // if (redirect) {
        //     window.open(link,'_blank');
        //     return <Redirect to={'/Incidents'} />
        // }

        return (
            <div>
                <h2>{link}</h2>
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