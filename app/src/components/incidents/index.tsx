import * as React from 'react'
import * as types from '../../store/types'
import Spinner from '../utilities/spinner'

type props = {
    incidents: types.incident[]
}

export default class Incidents extends React.Component<props, {}> {

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

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