import * as React from 'react';
import Autocomplete from '../../formElements/autocomplete'
import * as style from '../constants'

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
        this.setState({
            coords: props.coords,
            address: props.address,
        }, function (this) {
            this.props.enableButton(this.state)
        })
    }

    render() {

        const {
            address,
        } = this.state

        return (
            <div className='text-center'>
                <h4>Update address</h4>
                <div style={style.customWidth}>
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

