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
                <div className='map-container' style={{ marginLeft: 'calc(-50vw + 50%)', width: '100vw !important' }}>
                    <Map
                        coords={this.props.coords}
                        style={{ height: '200px', width: '100vw', marginBottom: '25px' }} 
                        zoom={16}/>
                </div>
            </div>

        )
    }
}