import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
const placeholder = require('../../../images/image-placeholder.png')

type props = {
    incident: types.incident
}

export default class StreetView extends React.Component<props, {}> {
    render() {
        if (this.props.incident.coords) {
            var coords = this.props.incident.coords.replace('(', '').replace(')', '')
            var url = 'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + coords + '&fov=60&heading=235&pitch=10&key=AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4'
        }
        else {
            var url = placeholder as string
        }
        return (
            <div className='row text-center' style={style.padding}>
                <img style={style.imgStyle} src={url} />
            </div>
        )
    }
}