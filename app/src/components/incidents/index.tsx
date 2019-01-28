import * as React from 'react';
import ReactTable from "react-table";
import Filters from './filters'
import Moment from 'react-moment'
import Modal from 'react-responsive-modal'
import Paging from '../utilities/paging'
import Format from 'date-format'
import * as types from '../../store/types'
import Spinner from '../utilities/spinner'

type props = {
    incidents: types.incident[]
}

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
    Cell: props => <a style={reportLink} target='_blank' href={props.value}>View report</a>
}, {
    Header: 'Date',
    accessor: 'date',
    Cell: props => <Moment format="MM/DD/YYYY HH:mm" date={props.value} />
}, {
    Header: 'Address',
    accessor: 'address'
}, {
    Header: 'Reason',
    accessor: 'reasonForVisit'
},{
    Header: 'Open',
    accessor: 'open'
}, {
    Header: 'Note',
    accessor: 'note'
}]

export default class AllIncidents extends React.Component<props, {}> {

    public render() {
        return (
            <div>
                {this.props.incidents.length == 0 &&
                    <Spinner notice='...loading incidents...' />
                }
                All incidents here
            </div>
        )
    }
}