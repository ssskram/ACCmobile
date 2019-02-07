import * as React from 'react'
import * as types from '../../../store/types'

type props = {
    incident: types.incident,
    setState: (stateObj: object) => void
    closeIncident: () => void
    openIncident: () => void
}

export default class Buttons extends React.Component<props, {}> {
    render() {
        return (
            <div className='col-md-12 text-center'>
                <button className='btn btn-secondary' onClick={() => this.props.setState({ addressModalIsOpen: true })}>Change address</button>
                <button className='btn btn-secondary' onClick={() => this.props.setState({ incidentModalIsOpen: true })}>Edit incident</button>
                {this.props.incident.open == 'Yes' &&
                    <button className='btn btn-secondary' onClick={() => this.props.closeIncident()}>Close incident</button>
                }
                {this.props.incident.open == 'No' &&
                    <button className='btn btn-secondary' onClick={() => this.props.openIncident()}>Reopen incident</button>
                }
                <br />
                <br/>
            </div>
        )
    }
}