import * as React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

export default class selectMap extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const key = process.env.REACT_APP_GOOGLE_API;
    const place = require("../../images/place.png");
    const MapComponent = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=" +
          key +
          "&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.coords}
        defaultOptions={{
          styles: mapStyles as any,
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          zoomControl: true,
          rotateControl: false,
          fullscreenControl: false
        }}
      >
        <Marker position={this.props.coords} defaultIcon={place} />
      </GoogleMap>
    ));
    return (
      <div style={this.props.style}>
        <MapComponent />
      </div>
    );
  }
}
