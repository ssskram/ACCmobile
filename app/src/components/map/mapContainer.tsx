import * as React from 'react'
import Map from './map'
import * as style from '../report/constants'

type props = {
    coords: object
}

export default class MapContainer extends React.Component<props, {}> {

    public render() {
        return (
            <div className='row' style={style.padding}>
                <div className='map-container'>
                    <Map coords={this.props.coords} />
                </div>
            </div>

        )
    }
}