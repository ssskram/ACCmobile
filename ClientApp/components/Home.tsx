import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Ping from '../store/ping';
import * as MessagesStore from '../store/messages';
import * as Incidents from '../store/incidents';
import * as Animals from '../store/animals';
import * as Dropdowns from '../store/dropdowns';
import Messages from './Messages';

export class Home extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // load store
        this.props.getIncidents()
        this.props.getAnimals()
        this.props.getDropdowns()
    }

    componentWillUnmount() {
        this.props.clear()
    }

    public render() {
        return <div className="home-container">
            <img src='./images/acclogo.png' className="img-responsive center-block home-image" />
            <div className='text-center'>
                <div className="row text-center">
                    <Messages messages={this.props.messages} />
                </div>
                <hr />
            </div>
            <div className='row'>
                <div className='col-md-6 text-center'>
                    <Link to={'/Incidents'} type="button" className="btn btn-big">
                        <i className="glyphicon glyphicon-search home-icon"></i><br />
                        <div className="hidden-md">Search incidents</div>
                        <div className="hidden-xs hidden-sm hidden-lg">Search</div>
                    </Link>
                </div>
                <div className='col-md-6 text-center'>
                    <Link to={'/Submit'} type="button" title="Email, OneDrive, etc." className="btn btn-big">
                        <i className="glyphicon glyphicon-plus home-icon"></i><br />
                        <div className="hidden-md">New incident</div>
                        <div className="hidden-xs hidden-sm hidden-lg hidden-xl">New</div>
                    </Link>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
        ...state.ping,
        ...state.incidents,
        ...state.animals,
        ...state.dropdowns
    }),
    ({
        ...MessagesStore.actionCreators,
        ...Ping.actionCreators,
        ...Incidents.actionCreators,
        ...Animals.actionCreators,
        ...Incidents.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Home as any) as typeof Home;