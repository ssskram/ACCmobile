import * as React from 'react';
import Autocomplete from '../../FormElements/autocomplete'
import Map from '../../Map/MapContainer'

export default class updateAddress extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            map: false,
            address: '',
            coords: {},
        }
    }

    clearCoords() {
        this.setState({
            map: false,
            coords: {}
        })
    }

    handleAutcomplete(props) {
        this.setState({
            coords: props.coords,
            address: props.address,
            map: true
        })
    }

    render() {
        const {
            coords,
            address
        } = this.props

        const {
            map,
            adderess
        } = this.state

        return (
            <div>
                <div className='row'>
                    <div className='row'>
                        <Autocomplete
                            value={address}
                            callback={this.handleAutcomplete.bind(this)}
                            clearCoords={this.clearCoords.bind(this)}
                        />
                    </div>
                    {map === true &&
                        <div className='row'>
                            <Map coords={coords} />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

