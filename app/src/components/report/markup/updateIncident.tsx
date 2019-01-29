import * as React from 'react'
import Modal from 'react-responsive-modal'
import Fields from '../../submit/incident'
import * as types from '../../../store/types'

type props = {
    incidentModalIsOpen: boolean
    incident: types.incident
    closeModal: () => void
    putIncident: () => void
}

export default class UpdateIncident extends React.Component<props, {}> {
    render() {
        return (
            <Modal
                open={this.props.incidentModalIsOpen}
                onClose={() => this.props.closeModal()}
                closeOnEsc={false}
                classNames={{
                    overlay: 'custom-overlay',
                    modal: 'custom-modal'
                }}
                center>
                <div>
                    <h3 className='text-center'>Update incident</h3>
                    <Fields
                        putIt={this.props.putIncident()}
                        incident={this.props.incident}
                        put={true}
                    />
                </div>
            </Modal>
        )
    }
}