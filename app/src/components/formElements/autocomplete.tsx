import * as React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export default class autocomplete extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      coords: {},
      address: ""
    };
  }

  handleChange = address => {
    this.setState({ address: address });
    this.props.clearCoords();
  };

  handleSelect = address => {
    geocodeByAddress(address).then(results =>
      this.setState({
        address: results[0].formatted_address
      })
    );
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        this.setState(
          {
            coords: latLng
          },
          function(this) {
            this.props.callback(this.state);
          }
        )
      );
  };

  public render() {
    const { address } = this.state;

    return (
      <div className="col-md-12">
        <div className="form-group">
          <div className="col-md-1" />
          <div className="col-md-10 form-element">
            <PlacesAutocomplete
              value={address}
              onChange={this.handleChange.bind(this)}
              onSelect={this.handleSelect.bind(this)}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Enter an address...",
                      className: "form-control"
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="col-md-1" />
        </div>
      </div>
    );
  }
}
