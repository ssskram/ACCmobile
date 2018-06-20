import * as React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

export class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        document.body.style.backgroundColor = "rgb(44, 62, 80)";
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = null;
    }

    render() {
        return (
            <div id="map">
                <Map
                    className="map"
                    google={this.props.google}
                    initialCenter={{
                        lat: '40.437470539681442',
                        lng: '-79.987124601795273'
                    }}
                    zoom={13}>
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g')
})(selectMap)
