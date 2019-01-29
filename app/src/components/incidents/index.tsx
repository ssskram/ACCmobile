import * as React from 'react'
import Filters from './filters'
import * as types from '../../store/types'
import Table from './markup/table'
import Cards from './markup/cards'
import Loading from './markup/loading'
import runFilter from './functions/filter'
import Buttons from './markup/contriolButtons'
import NullSearch from './markup/nullSearch'

type props = {
    incidents: types.incident[]
}

type state = {
    onFilter: boolean
    format: string
    incidents: types.incident[]
    currentPage: number
    incidentsPerPage: number
    itemCount: number
    filters: boolean
    clearFilters: boolean
    address: string
    status: string
    date: string
    reasonForVisit: string
    note: string
}

export default class AllIncidents extends React.Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            onFilter: false,
            format: 'cards',
            incidents: props.incidents.sort((a, b) => +new Date(b.date) - +new Date(a.date)),
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

    // set incident props to state when you get 'em
    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            if (this.state.onFilter === false) {
                this.setState({
                    incidents: nextProps.incidents.sort((a, b) => +new Date(b.date) - +new Date(a.date)),
                    itemCount: nextProps.incidents.length,
                })
            }
        }
    }

    // filter incidents with buttons and stuff
    filter(state) {
        const filtered = runFilter(state, this.props)
        this.setState({
            clearFilters: false,
            currentPage: 1,
            incidents: filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date)),
            itemCount: filtered.length,
        })
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

        return (
            <div>
                {this.props.incidents.length == 0 &&
                    <Loading />
                }
                {this.props.incidents.length > 0 &&
                    <div className='incident-container col-md-8 col-md-offset-2'>
                        <Buttons
                            incidents={incidents}
                            itemCount={itemCount}
                            filters={filters}
                            format={format}
                            setState={this.setState.bind(this)}
                        />
                        <Filters
                            showFilters={filters}
                            incidents={incidents}
                            clearFilters={clearFilters}
                            filter={this.filter.bind(this)}
                        />
                        <div className="col-md-12 table-container">
                            {format == 'cards' && itemCount != 0 &&
                                <Cards 
                                    currentPage={currentPage}
                                    incidentsPerPage={incidentsPerPage}
                                    incidents={incidents}
                                    setState={this.setState.bind(this)}
                                />
                            }
                            {format == 'table' && itemCount != 0 &&
                                <Table incidents={incidents} />
                            }
                            {itemCount == 0 &&
                                <NullSearch />
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}