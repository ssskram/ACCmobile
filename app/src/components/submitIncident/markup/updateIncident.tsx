import * as React from 'react'
import Modal from 'react-responsive-modal'
import Fields from './incident'
import * as types from '../../../store/types'

type props = {
    incidentModalIsOpen: boolean
    incident: types.incident
    closeModal: () => void
    getDropdowns: () => void
    dropdowns: types.dropdowns
    user: types.user
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
                        getDropdowns={this.props.getDropdowns}
                        dropdowns={this.props.dropdowns}
                        user={this.props.user}
                        put={true}
                        incidentUUID={this.props.incident.uuid}
                        address={this.props.incident.address}
                        coords={this.props.incident.coords}
                        ownersLastName={this.props.incident.ownersLastName}
                        ownersFirstName={this.props.incident.ownersFirstName}
                        ownersTelephoneNumber={this.props.incident.ownersTelephoneNumber}
                        callOrigin={this.props.incident.callOrigin}
                        reasonForVisit={this.props.incident.reasonForVisit}
                        pghCode={this.props.incident.pghCode}
                        citationNumber={this.props.incident.citationNumber}
                        officerInitials={this.props.incident.officerInitials}
                        note={this.props.incident.note}
                        open={this.props.incident.open}
                        itemId={this.props.incident.itemId}
                        submittedBy={this.props.incident.submittedBy}
                    />
                </div>
            </Modal>
        )
    }
}