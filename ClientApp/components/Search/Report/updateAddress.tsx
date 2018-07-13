import * as React from 'react';
import Autocomplete from '../../FormElements/autocomplete'

const customWidth = {
    minWidth: '50vw'
}

export default class updateAddress extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            coords: {},
        }
    }

    disableButton() {
        this.props.disableButton()
    }

    handleAutcomplete(props) {
        this.props.enableButton()
        this.setState({
            coords: props.coords,
            address: props.address,
        })
    }

    render() {

        const {
            address,
        } = this.state

        return (
            <div className='text-center'>
                <h4>Update address</h4>
                <div style={customWidth}>
                    <Autocomplete
                        value={address}
                        callback={this.handleAutcomplete.bind(this)}
                        clearCoords={this.disableButton.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

