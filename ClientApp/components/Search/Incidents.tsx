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
            electronicIncidents: this.props.electronicIncidents,
            analogIncidents: this.props.analogIncidents
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        // get electronic
        // get analog
    }

    componentWillReceiveProps(props) {
        if (props.electronicIncidents !== this.state.electronicIncidents) {
            this.setState({ electronicIncidents: props.electronicIncidents });
        }
        if (props.analogIncidents !== this.state.analogIncidents) {
            this.setState({ analogIncidents: props.analogIncidents });
        }
    }

    filter(event) {
        if (event.target.value == '') {
            this.setState({
                requests: this.props.requests
            });
        }
        else {
            var result = this.props.requests.filter(function (obj) {
                return obj.building.toLowerCase().includes(event.target.value.toLowerCase()) ||
                    obj.status.toLowerCase().includes(event.target.value.toLowerCase());
            });
            this.setState({
                requests: result
            });
        }
    }

    public render() {
        const { requests } = this.state

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="form-element">
                                <h3 className="form-h">Search incidents</h3>
                                <input name="filter" id="filter" className="selectpicker form-control" placeholder="Filter by address" onChange={this.filter.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 table-container">
                    <ReactTable
                        data={requests}
                        columns={columns}
                        loading={false}
                        defaultPageSize={10}
                        noDataText='Nothing to see here'
                        defaultSorted={[
                            {
                                id: 'submitted',
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