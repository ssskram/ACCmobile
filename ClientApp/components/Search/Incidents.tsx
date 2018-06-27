import * as React from 'react';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import * as AllIncidents from '../../store/incidents'
import Filters from './Filters'
import Moment from 'react-moment'
import Modal from 'react-responsive-modal';

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
            onFilter: false,
            modalIsOpen: false,
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

        // throw spinner
        if (Object.keys(this.state.incidents).length == 0) {
            this.setState({
                modalIsOpen: true
            })
        }

        // ping server
        this.props.ping()

        // load store
        this.props.getIncidents()
    }

    componentWillReceiveProps(props) {
        if (this.state.onFilter === false) {
            this.setState({
                incidents: props.incidents,
                modalIsOpen: false
            });
        }
    }

    showFilters() {
        this.setState({
            onFilter: true,
            filters: true
        });
    }

    hideFilters() {
        this.setState({
            onFilter: false,
            filters: false,
            incidents: this.props.incidents
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    filter(state) {
        if (state.address) {
            var address = state.address.toLowerCase()
        }
        if (state.date) {
            var date = state.date.toLowerCase()
        }
        if (state.submittedBy) {
            var submittedBy = state.submittedBy.toLowerCase()
        }
        if (state.status) {
            var open = state.status.toLowerCase()
        }
        if (state.reasonForVisit) {
            var reasonForVisit = state.reasonForVisit.toLowerCase()
        }
        if (state.note) {
            var note = state.note.toLowerCase()
        }
        var filtered = this.props.incidents.filter(function (item) {
            if (address) {
                if (!item.address.toLowerCase().includes(address)) {
                    return false
                }
            }            
            if (date) {
                if (!item.date.toLowerCase().includes(date)) {
                    return false
                }
            }
            if (submittedBy) {
                if (item.submittedBy) {
                    if (!item.submittedBy.toLowerCase().includes(submittedBy)) {
                        return false
                    }
                }
                else if (!item.submittedBy) {
                    return false
                }
            }
            if (open) {
                if (item.open) {
                    if (!item.open.toLowerCase().includes(open)) {
                        return false
                    }
                }
                else if (!item.open) {
                    return false
                }
            }
            if (reasonForVisit) {
                if (item.reasonForVisit) {
                    if (!item.reasonForVisit.toLowerCase().includes(reasonForVisit)) {
                        return false
                    }
                }
                else if (!item.reasonForVisit) {
                    return false
                }
            }
            if (note) {
                if (item.note) {
                    if (!item.note.toLowerCase().includes(note)) {
                        return false
                    }
                }
                else if (!item.note) {
                    return false
                }
            }
            return true
        })
        this.setState({ incidents: filtered })
    }

    public render() {
        const { 
            modalIsOpen, 
            filterType,
            incidents, 
            filters } = this.state

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
                <hr/>
                <div className='row text-center'>
                    {filters === true &&
                        <button className='btn btn-default' onClick={this.hideFilters.bind(this)}>Clear filters</button>
                    }
                    {filters === false &&
                        <button className='btn btn-default' onClick={this.showFilters.bind(this)}>Show filters</button>
                    }
                </div>
                {filters === true &&
                    <Filters incidents={incidents} filter={this.filter.bind(this)} />
                }
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
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        transitionExit: 'transition-exit-active',
                        transitionExitActive: 'transition-exit-active',
                        overlay: 'spinner-overlay',
                        modal: 'spinner-modal'
                    }}
                    animationDuration={1000}
                    closeOnEsc={false}
                    closeOnOverlayClick={false}
                    showCloseIcon={false}
                    center>
                    <div className="loader"></div>
                    ...loading all incidents...
                </Modal>
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