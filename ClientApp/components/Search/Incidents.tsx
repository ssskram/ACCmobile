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
import Paging from './Paging'
import Format from 'date-format'

const openIncident = {
    color: 'red'
}

const reportLink = {
    fontSize: '16px'
}

const imgStyle = {
    width: '150px',
    height: '150px',
}

const marginTop = {
    marginTop: '10px'
}

const noteContainer = {
    backgroundColor: 'rgba(92, 184, 92, .2)',
    borderRadius: '10px',
    width: '60%',
    margin: '0 auto',
    padding: '5px'
}

const columns = [{
    Header: '',
    accessor: 'link',
    Cell: props => <Link style={reportLink} target='_blank' to={props.value}>View report</Link>
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
    Header: 'Open',
    accessor: 'open'
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
            format: 'cards',
            incidents: this.props.incidents.sort(function (a, b) {
                return +new Date(b.date) - +new Date(a.date);
            }),
            currentPage: 1,
            incidentsPerPage: 10,
            itemCount: this.props.incidents.length,
            filters: false,
            address: '',
            status: '',
            date: '',
            reasonForVisit: '',
            note: '',
        }
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }


    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
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

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            if (this.state.onFilter === false) {
                this.setState({
                    incidents: nextProps.incidents.sort(function (a, b) {
                        return +new Date(b.date) - +new Date(a.date);
                    }),
                    itemCount: nextProps.incidents.length,
                });
            }
            if (nextProps.incidents.length > 0) {
                this.setState({
                    modalIsOpen: false
                });
            }
        }
    }

    showFilters() {
        this.setState({
            onFilter: true,
            filters: true
        });
    }

    clearFilters() {
        this.setState({
            onFilter: false,
            filters: false,
            incidents: this.props.incidents.sort(function (a, b) {
                return +new Date(b.date) - +new Date(a.date);
            }),
            itemCount: this.props.incidents.length,
            currentPage: 1
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
            var date = new Date(state.date)
            var formattedDate = Format('yyyy-MM-dd', date)
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
            if (formattedDate) {
                if (!item.date.includes(formattedDate)) {
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
        this.setState({
            currentPage: 1,
            incidents: filtered.sort(function (a, b) {
                return +new Date(b.date) - +new Date(a.date);
            }),
            itemCount: filtered.length,
        })
    }

    toggleViewFormat() {
        window.scrollTo(0, 0)
        if (this.state.format == 'cards') {
            this.setState({
                currentPage: 1,
                format: 'table'
            })
        }
        if (this.state.format == 'table') {
            this.setState({
                format: 'cards',
                currentPage: 1
            })
        }
    }

    public render() {
        const {
            currentPage,
            incidentsPerPage,
            itemCount,
            modalIsOpen,
            incidents,
            filters,
            format } = this.state

        // Logic for paging
        const indexOfLastIncident = currentPage * incidentsPerPage;
        const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
        const currentIncidents = incidents.slice(indexOfFirstIncident, indexOfLastIncident);
        const renderIncidents = currentIncidents.map((incident, index) => {
            if (incident.coords) {
                var coords = incident.coords.replace('(', '').replace(')', '');;
                var url = 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + coords + '&fov=60&heading=235&pitch=10&key=AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4'
            }
            else {
                var url = '../images/image-placeholder.png'
            }
            return <div className="container-fluid" key={index}>
                <div className="row">
                    <div className="incident">
                        <div className="panel">
                            <div className="panel-body text-center">
                                <div className='col-sm-12 hidden-md hidden-lg hidden-xl text-center'>
                                    {incident.open === 'Yes' &&
                                        <h4 style={openIncident}>Open incident</h4>
                                    }
                                    {incident.open === 'No' &&
                                        <h4>Closed incident</h4>
                                    }
                                    {incident.open == null &&
                                        <h4>Scanned document</h4>
                                    }
                                </div>
                                <div className='col-md-3 hidden-sm hidden-xs'>
                                    <img style={imgStyle} src={url} />
                                </div>
                                <div className="col-md-6 incident-card-container">
                                    <div style={reportLink}><strong>{incident.address}</strong></div>
                                    <h4><Moment format="MM/DD/YYYY HH:mm" date={incident.date} /></h4>
                                    <h4><i>{incident.reasonForVisit}</i></h4>
                                    <div>Incident ID: {incident.itemId} </div>
                                    <div className='hidden-md hidden-lg hidden-xl'>
                                        {incident.note != null &&
                                            <div><b>Note:</b> {incident.note}</div>
                                        }
                                        <Link style={reportLink} target='_blank' to={incident.link}>View report</Link>
                                    </div>
                                </div>
                                <div className='col-md-3 hidden-sm hidden-xs text-center'>
                                    {incident.open === 'Yes' &&
                                        <h4 style={openIncident}>Open incident</h4>
                                    }
                                    {incident.open === 'No' &&
                                        <h4>Closed incident</h4>
                                    }
                                    {incident.open == null &&
                                        <h4>Scanned document</h4>
                                    }
                                    {incident.note != null &&
                                        <div style={noteContainer}>
                                            <h5><strong>Note:</strong></h5>
                                            <div>{incident.note}</div>
                                        </div>
                                    }
                                    <h5>
                                        <Link style={reportLink} target='_blank' to={incident.link}>View report</Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        });

        // Logic for displaying page numbers
        const pageNumbers: any[] = []
        for (let i = 1; i <= Math.ceil(incidents.length / incidentsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div className='incident-container'>
                <div className='row text-center'>
                    <div className='col-md-4'>
                        <h2>{itemCount} Incidents</h2>
                    </div>
                    <div className='col-md-4' style={marginTop}>
                        {filters === true &&
                            <button className='btn btn-secondary' onClick={this.clearFilters.bind(this)}>Clear all filters</button>
                        }
                        {filters === false &&
                            <button className='btn btn-secondary' onClick={this.showFilters.bind(this)}>Show more filters</button>
                        }
                    </div>
                    <div className='col-md-4 hidden-sm hidden-xs' style={marginTop}>
                        {format == 'cards' &&
                            <button className='btn btn-secondary' onClick={this.toggleViewFormat.bind(this)}>Toggle table view</button>
                        }
                        {format == 'table' &&
                            <button className='btn btn-secondary' onClick={this.toggleViewFormat.bind(this)}>Toggle card view</button>
                        }
                    </div>
                </div>
                <Filters showFilters={filters} incidents={incidents} filter={this.filter.bind(this)} />
                <div className="col-md-12 table-container">
                    {format == 'cards' && itemCount != 0 &&
                        <div>
                            {renderIncidents}
                            <Paging
                                countIncidents={incidents}
                                currentPage={currentPage}
                                totalPages={pageNumbers}
                                modalIsOpen={modalIsOpen}
                                next={this.handleNextClick.bind(this)}
                                prev={this.handlePreviousClick.bind(this)} />
                        </div>
                    }
                    {format == 'table' && itemCount != 0 &&
                        <div>
                            <ReactTable
                                data={incidents}
                                columns={columns}
                                loading={false}
                                minRows={0}
                                pageSize={100}
                                showPageSizeOptions={false}
                                noDataText=''
                                defaultSorted={[
                                    {
                                        id: 'date',
                                        desc: true
                                    }
                                ]}
                            />
                        </div>
                    }
                    {itemCount == 0 && modalIsOpen == false &&
                        <div className='text-center'>
                            <br />
                            <h2>Sorry, I can't find anything<br />matching those parameters</h2>
                        </div>
                    }
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