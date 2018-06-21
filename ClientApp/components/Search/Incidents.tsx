import * as React from 'react';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import Filters from './Filters'

const columns = [{
    Header: '',
    accessor: 'link'
}, {
    Header: 'No.',
    accessor: 'number'
}, {
    Header: 'Date',
    accessor: 'date',
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
            address: '',
            status: 'All',
            submittedBy: 'All',
            date: '',
            reasonForVisit: 'All',
            note: ''

        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // reload incidents
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
        const { incidents, filters } = this.state

        return (
            <div>
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
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(Incidents as any) as typeof Incidents;