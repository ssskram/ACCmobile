import * as React from 'react'
import Map from './map'

export default class MapContainer extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            coords: props.coords
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            coords: props.coords
        })
    }

    public render() {
        const { coords } = this.state

        return (
            <div className='map-container'>
                <Map coords={coords} />
            </div>
        )
    }
}