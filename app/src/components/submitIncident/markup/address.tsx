import * as React from 'react'
import Autocomplete from '../../formElements/autocomplete'
import Map from '../../map/mapContainer'
import * as constants from '../constants'

type props = {
    address: string
    map: boolean
    coords: object
    setState: (stateObj: object) => void
}

export default class Address extends React.Component<props, {}> {

    clearCoords() {
        this.props.setState({
            map: false,
            coords: {}
        })
    }

    handleAutocomplete(props) {
        this.props.setState({
            coords: props.coords,
            address: props.address,
            map: true
        })
    }

    render() {
        return (
            <div>
                <h3>Address</h3>
                <hr />
                <div style={constants.sectionPadding}>
                    <div className='row'>
                        <Autocomplete
                            value={this.props.address}
                            callback={this.handleAutocomplete.bind(this)}
                            clearCoords={this.clearCoords.bind(this)}
                        />
                    </div>
                    {this.props.map === true &&
                        <div className='row'>
                            <Map coords={this.props.coords} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}