import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'

type props = {
    incident: types.incident
}

export default class Header extends React.Component<props, {}> {
    render() {
        return (
            <div className='text-center'>
                <h3 className='oswald-header'>{this.props.incident.address}</h3>
                {this.props.incident.open == 'Yes' &&
                    <h4 className='open'>Open incident</h4>
                }
                {this.props.incident.open == 'No' &&
                    <h4>Closed incident</h4>
                }
                <h5>Incident ID: {this.props.incident.itemId}</h5>
                <br />
            </div>
        )
    }
}