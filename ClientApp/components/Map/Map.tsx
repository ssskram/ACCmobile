import * as React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

export class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Map
                    className="map"
                    google={this.props.google}
                    initialCenter={this.props.coords}
                    zoom={13}>
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g')
})(selectMap)
