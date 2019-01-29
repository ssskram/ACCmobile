import * as React from 'react'
import Moment from 'react-moment'
import * as style from '../constants'
import ReactTable from "react-table"
import "react-table/react-table.css"
import * as moment from 'moment'
import * as types from '../../../store/types'

type props = {
    incidents: types.incident[]
}

export default class Table extends React.Component<props, {}> {

    public render() {

        const columns = [{
            Header: '',
            accessor: 'link',
            Cell: props => <a style={style.reportLink} target='_blank' href={props.value}>View report</a>
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
        }, {
            Header: 'Open',
            accessor: 'open'
        }, {
            Header: 'Note',
            accessor: 'note'
        }]


        return (
            <div>
                <ReactTable
                    data={this.props.incidents}
                    columns={columns}
                    loading={false}
                    minRows={0}
                    pageSize={100}
                    showPageSizeOptions={false}
                    noDataText=''
                    defaultSorted={[
                        {
                            id: moment('date'),
                            asc: true
                        }
                    ]}
                />
            </div>
        )
    }
}