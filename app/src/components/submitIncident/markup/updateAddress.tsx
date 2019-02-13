import * as React from 'react'
import Modal from 'react-responsive-modal'
import Autocomplete from '../../formElements/autocomplete'
import * as style from '../../report/constants'

type props = {
    addressModalIsOpen: boolean
    enableAddressButton: boolean
    closeModal: () => void
    disableButton: () => void
    enableButton: (stateOb: object) => void
    putIncident: () => void
}

type state = {
    address: string
    coords: object
}

export default class updateAddress extends React.Component<props, state> {
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
        }, () => this.props.enableButton(this.state))
    }

    render() {

        const {
            address,
        } = this.state

        return (
            <Modal
                open={this.props.addressModalIsOpen}
                onClose={() => this.props.closeModal()}
                closeOnEsc={false}
                classNames={{
                    overlay: 'custom-overlay',
                    modal: 'custom-modal'
                }}
                center>
                <div>
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
                    <div className='col-md-12 text-center'>
                        <button disabled={!this.props.enableAddressButton} onClick={() => this.props.putIncident()} className='btn btn-success'>Save</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

