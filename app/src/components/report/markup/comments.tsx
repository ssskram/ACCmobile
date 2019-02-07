import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'

const talkBubble = require('../../../images/talkBubble.png')

type props = {
    incident: types.incident
}

export default class Comments extends React.Component<props, {}> {
    render() {
        return (
            <div className='row' style={{ marginTop: '45px' }}>
                <div>
                    <span style={{ fontSize: '1.5em' }}>Comments</span>
                    <img style={style.iconStyle} className='pull-right' src={talkBubble as string} />
                </div>
                <div className='reportcomments'>
                    <div style={style.lineBreaks}>{this.props.incident.comments}</div>
                </div>
            </div>
        )
    }
}