import * as React from 'react';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';

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
        const { incidents } = this.state

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="form-element">
                                <h3 className="form-h">Search incidents</h3>
                                <input name="filter" id="filter" className="selectpicker form-control" placeholder="Filter by address" onChange={this.filterAddress.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 table-container">
                    <ReactTable
                        data={incidents}
                        columns={columns}
                        loading={false}
                        defaultPageSize={10}
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