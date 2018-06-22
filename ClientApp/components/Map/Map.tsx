import * as React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Autocomplete from '../FormElements/autocomplete'

export class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            address: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div>
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
