import * as React from 'react'
import Filters from './filters'
import Paging from '../utilities/paging'
import Format from 'date-format'
import * as types from '../../store/types'
import Table from './markup/table'
import Card from './markup/card'
import Loading from './markup/loading'

type props = {
    incidents: types.incident[]
}

export default class AllIncidents extends React.Component<props, any> {
    constructor(props) {
        super(props);
        this.state = {
            onFilter: false,
            format: 'cards',
            incidents: props.incidents.sort(function (a, b) {
                return +new Date(b.date) - +new Date(a.date)
            }),
            currentPage: 1,
            incidentsPerPage: 10,
            itemCount: props.incidents.length,
            filters: false,
            clearFilters: false,
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

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            if (this.state.onFilter === false) {
                this.setState({
                    incidents: nextProps.incidents.sort(function (a, b) {
                        return +new Date(b.date) - +new Date(a.date);
                    }),
                    itemCount: nextProps.incidents.length,
                })
            }
            if (nextProps.incidents.length > 0) {
                this.setState({
                    modalIsOpen: false
                })
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
            incidents: this.props.incidents.sort(function (a, b) {
                return +new Date(b.date) - +new Date(a.date);
            }),
            itemCount: this.props.incidents.length,
            currentPage: 1,
            clearFilters: true
        })

    }

    hideFilters() {
        this.setState({
            onFilter: false,
            filters: false
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    filter(state) {
        this.setState({
            clearFilters: false
        })

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
            incidents,
            filters,
            format,
            clearFilters
        } = this.state

        // Logic for paging
        const indexOfLastIncident = currentPage * incidentsPerPage;
        const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
        const currentIncidents = incidents.slice(indexOfFirstIncident, indexOfLastIncident);
        const renderIncidents = currentIncidents.map((incident, index) => {
            <Card incident={incident} key={index}/>
        })

        // Logic for displaying page numbers
        const pageNumbers: any[] = []
        for (let i = 1; i <= Math.ceil(incidents.length / incidentsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div>
                {this.props.incidents.length == 0 &&
                    <Loading />
                }
                {this.props.incidents.length > 0 &&
                    <div className='incident-container col-md-8 col-md-offset-2'>
                        <div className='row text-center'>
                            <div className='col-md-4'>
                                <div style={{ fontSize: '2.3em' }}>{itemCount} Incidents</div>
                            </div>
                            <div>
                                <button className='btn btn-secondary' onClick={this.clearFilters.bind(this)}>Clear all filters</button>
                                {filters === true &&
                                    <button className='btn btn-secondary' onClick={this.hideFilters.bind(this)}>Hide filters</button>
                                }
                                {filters === false &&
                                    <button className='btn btn-secondary' onClick={this.showFilters.bind(this)}>More filters</button>
                                }
                                {format == 'cards' &&
                                    <button className='btn btn-secondary' onClick={this.toggleViewFormat.bind(this)}>Toggle table view</button>
                                }
                                {format == 'table' &&
                                    <button className='btn btn-secondary' onClick={this.toggleViewFormat.bind(this)}>Toggle card view</button>
                                }
                            </div>
                        </div>
                        <Filters showFilters={filters} incidents={incidents} clearFilters={clearFilters} filter={this.filter.bind(this)} />
                        <div className="col-md-12 table-container">
                            {format == 'cards' && itemCount != 0 &&
                                <div>
                                    {renderIncidents}
                                    <Paging
                                        countIncidents={incidents}
                                        currentPage={currentPage}
                                        totalPages={pageNumbers}
                                        next={this.handleNextClick.bind(this)}
                                        prev={this.handlePreviousClick.bind(this)} />
                                </div>
                            }
                            {format == 'table' && itemCount != 0 &&
                                <Table incidents={incidents} />
                            }
                            {itemCount == 0 &&
                                <div className='text-center'>
                                    <br />
                                    <h2>Sorry, I can't find anything<br />matching those parameters</h2>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}