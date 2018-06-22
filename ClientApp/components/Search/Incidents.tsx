import * as React from 'react';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import * as AllIncidents from '../../store/incidents'
import Filters from './Filters'
import Moment from 'react-moment';
import Map from '../Map/Map'

const columns = [{
    Header: '',
    accessor: 'link',
    Cell: props => <Link target='_blank' to={props.value}>Report</Link>
}, {
    Header: 'No.',
    accessor: 'itemId'
}, {
    Header: 'Date',
    accessor: 'date',
    Cell: props => <Moment format="MM/DD/YYYY HH:mm" date={props.value} />
}, {
    Header: 'Address',
    accessor: 'address'
}, {
    Header: 'Reason(s) for Visit',
    accessor: 'reasonForVisit',
}, {
    Header: 'Note',
    accessor: 'note'
}]

export class Incidents extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            incidents: this.props.incidents,
            filters: false,
            map: false,
            address: '',
            status: 'All',
            submittedBy: 'All',
            date: '',
            reasonForVisit: 'All',
            note: '',
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // load store
        this.props.getIncidents()

        // set store to local state
        this.onSetResult(this.props, 'acc_state')
    }

    componentWillReceiveProps(props) {
        if (props.incidents !== this.state.incidents) {
            this.setState({ incidents: props.incidents });
        }
    }

    onSetResult = (props, key) => {
        localStorage.setItem(key, JSON.stringify(props));
    }

    showFilters() {
        this.setState({
            filters: true
        });
    }
    hideFilters() {
        this.setState({
            filters: false
        });
    }
    showMap() {
        this.setState({
            map: true
        });
    }
    hideMap() {
        this.setState({
            map: false
        });
    }

    filterAddress(event) {
        if (event.target.value == '') {
            this.setState({
                incidents: this.props.incidents
            });
        }
        else {
            var result = this.props.incidents.filter(function (obj) {
                return obj.address.toLowerCase().includes(event.target.value.toLowerCase())
            });
            this.setState({
                incidents: result
            });
        }
    }

    public render() {
        const { incidents, filters, status, submittedBy, map } = this.state
        const { user } = this.props

        return (
            <div>
                <div className='row text-center'>
                    {submittedBy === user &&
                        <h2>My incidents</h2>
                    }
                    {status === 'All' &&
                        <h2>All incidents</h2>
                    }
                    {status === 'Open' &&
                        <h2>Open incidents</h2>
                    }
                </div>
                <div className='row text-center'>
                    {filters === true &&
                        <button className='btn btn-default' onClick={this.hideFilters.bind(this)}>Hide filters</button>
                    }
                    {filters === false &&
                        <button className='btn btn-default' onClick={this.showFilters.bind(this)}>Show filters</button>
                    }
                </div>
                <div className='row text-center'>
                    {map === true &&
                        <button className='btn btn-default' onClick={this.showMap.bind(this)}>Hide map</button>
                    }
                    {map === false &&
                        <button className='btn btn-default' onClick={this.hideMap.bind(this)}>Show Map</button>
                    }
                </div>
                <div className="row">
                    {filters === true &&
                        <Filters />
                    }
                </div>
                <div className="row">
                    {map === true &&
                        <Map />
                    }
                </div>
                <div className="col-md-12 table-container">
                    <ReactTable
                        data={incidents}
                        columns={columns}
                        loading={false}
                        defaultPageSize={50}
                        noDataText='Nothing to see here'
                        defaultSorted={[
                            {
                                id: 'date',
                                desc: true
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.incidents
    }),
    ({
        ...Ping.actionCreators,
        ...AllIncidents.actionCreators
    })
)(Incidents as any) as typeof Incidents;