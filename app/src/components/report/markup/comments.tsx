import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'

type props = {
    incident: types.incident
}

export default class Comments extends React.Component<props, {}> {
    render() {
        return (
            <div className='reportcomments'>
                <h3>Comments:</h3>
                <div style={style.lineBreaks}>{this.props.incident.comments}</div>
            </div>
        )
    }
}