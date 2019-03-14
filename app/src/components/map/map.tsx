import * as React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

const mapStyles = [
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

export class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const place = require('../../images/place.png')

        return (
            <Map
                style={this.props.style}
                google={this.props.google}
                initialCenter={this.props.coords}
                center={this.props.coords}
                styles={mapStyles}
                zoom={this.props.zoom}>
                <Marker
                    position={this.props.coords}
                    icon={{
                        url: place,
                    }}
                />
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4')
})(selectMap)
