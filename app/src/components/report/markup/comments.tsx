import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'

type props = {
    incident: types.incident
}

export default class Comments extends React.Component<props, {}> {
    render() {
        return (
            <div className='row' style={{ marginTop: '50px' }}>
                <div style={{ fontSize: '1.7em' }}>
                    Comments
                </div>
                <hr />
                <div style={{ paddingLeft: '5px', whiteSpace: 'pre-wrap' }}>
                    {this.props.incident.comments}
                </div>
            </div>
        )
    }
}