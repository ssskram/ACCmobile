import * as React from 'react'
import * as types from '../../../store/types'

type props = {
    incidents: types.incident[]
    originalIncidents: types.incident[]
    itemCount: number
    filters: boolean
    format: string
    setState: (stateObj: object) => void
}

export default class Buttons extends React.Component<props, {}> {

    showFilters() {
        this.props.setState({
            onFilter: true,
            filters: true
        })
    }

    clearFilters() {
        this.props.setState({
            incidents: this.props.originalIncidents,
            itemCount: this.props.originalIncidents.length,
            filters: false,
            currentPage: 1,
            clearFilters: true
        })

    }

    hideFilters() {
        this.props.setState({
            onFilter: false,
            filters: false
        })
    }

    toggleViewFormat() {
        window.scrollTo(0, 0)
        if (this.props.format == 'cards') {
            this.props.setState({
                currentPage: 1,
                format: 'table'
            })
        }
        if (this.props.format == 'table') {
            this.props.setState({
                format: 'cards',
                currentPage: 1
            })
        }
    }

    public render() {
        return (
            <div className='col-md-12'>
                <button className='btn btn-secondary' onClick={this.clearFilters.bind(this)}>Clear all filters</button>
                {this.props.filters === true &&
                    <button className='btn btn-secondary' onClick={this.hideFilters.bind(this)}>Hide filters</button>
                }
                {this.props.filters === false &&
                    <button className='btn btn-secondary' onClick={this.showFilters.bind(this)}>More filters</button>
                }
                {this.props.format == 'cards' &&
                    <button className='btn btn-secondary hidden-xs' onClick={this.toggleViewFormat.bind(this)}>Toggle table view</button>
                }
                {this.props.format == 'table' &&
                    <button className='btn btn-secondary hidden-xs' onClick={this.toggleViewFormat.bind(this)}>Toggle card view</button>
                }
            </div>
        )
    }
}