import * as React from 'react';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import * as AllIncidents from '../../store/incidents'
import Filters from './Filters'
import Moment from 'react-moment'

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
            filterType: 'All',
            filters: false,
            address: '',
            status: '',
            date: '',
            reasonForVisit: '',
            note: '',
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // load store
        this.props.getIncidents()
    }

    componentWillReceiveProps(props) {
        if (props.incidents !== this.state.incidents) {
            this.setState({ incidents: props.incidents });
        }
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
        const { filterType, incidents, filters } = this.state

        return (
            <div>
                <div className='row text-center'>
                    {filterType === 'All' &&
                        <h2>All incidents</h2>
                    }
                    {filterType === 'Mine' &&
                        <h2>My incidents</h2>
                    }
                    {filterType === 'Open' &&
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
                <div className="row">
                    {filters === true &&
                        <Filters />
                    }
                </div>
                <div className="col-md-12 table-container">
                    <ReactTable
                        data={incidents}
                        columns={columns}
                        loading={false}
                        defaultPageSize={25}
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