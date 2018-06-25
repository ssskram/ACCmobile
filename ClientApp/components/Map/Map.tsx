import * as React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

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
        const place = require('../../icons/place.png');

        return (
            <div>
                <Map
                    className="map"
                    google={this.props.google}
                    initialCenter={this.props.coords}
                    styles={mapStyles}
                    zoom={17.5}>
                    <Marker
                        position={this.props.coords}
                        icon={{
                            url: place,
                        }}
                    />
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g')
})(selectMap)
