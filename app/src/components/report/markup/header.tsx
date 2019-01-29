import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'

type props = {
    incident: types.incident
}

export default class Header extends React.Component<props, {}> {
    render() {
        return (
            <div>
                <h3 className='text-center'><strong>{this.props.incident.address}</strong></h3>
                {this.props.incident.open == 'Yes' &&
                    <h4 className='text-center' style={style.red}>Open incident</h4>
                }
                {this.props.incident.open == 'No' &&
                    <h4 className='text-center'>Closed incident</h4>
                }
                <h5 className='text-center'>Incident ID: {this.props.incident.itemId}</h5>
                <br />
            </div>
        )
    }
}