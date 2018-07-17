import * as React from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../store';
import * as Ping from '../../../store/ping';
import * as Incidents from '../../../store/incidents';
import * as Dropdowns from '../../../store/dropdowns';
import Incident from './Incident'
import AnimalsTable from './Animals'
import Map from '../../Map/MapContainer'
import UpdateIncident from '../../Submit/Incident'
import UpdateAddress from './updateAddress'
import update from 'immutability-helper';

// keep original latlng & incident objects in case user bails from updates
let lat_lng = {}
let originalIncident = {}

const red = {
    color: 'red'
}

const lineBreaks = {
    whiteSpace: 'pre-wrap'
}

const imgStyle = {
    height: '200px',
    width: '75%',
    margin: '0 auto'
}

const padding = {
    padding: '10px'
}
export class Report extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            addressModalIsOpen: false,
            addressButtonIsActive: true,
            incidentModalIsOpen: false,
            spinnerIsOpen: true,
            incident: {},
            animals: [],
            latlng: {}
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        const param = { id: this.props.match.params.id }
        fetch('/api/animals/report?id=' + encodeURIComponent(param.id), {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    animals: data
                })
            });
        fetch('/api/incidents/report?id=' + encodeURIComponent(param.id), {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                // process coordinations
                var lat = data.coords.substring(
                    data.coords.lastIndexOf("(") + 1,
                    data.coords.lastIndexOf(",")
                )
                var lng = data.coords.substring(
                    data.coords.lastIndexOf(" ") + 1,
                    data.coords.lastIndexOf(")")
                )
                var latitude = parseFloat(lat)
                var longitude = parseFloat(lng)
                lat_lng = { lat: latitude, lng: longitude }
                originalIncident = data
                this.setState({
                    incident: data,
                    addressModalIsOpen: false,
                    incidentModalIsOpen: false,
                    spinnerIsOpen: false,
                    latlng: lat_lng
                })
            });

        // load store
        this.props.getIncidents()
        this.props.getDropdowns()
    }

    closeModal() {
        this.setState({
            addressModalIsOpen: false,
            incidentModalIsOpen: false,
            spinnerIsOpen: false,
            latlng: lat_lng,
            incident: originalIncident
        });
    }

    updateIncident() {
        this.setState({
            incidentModalIsOpen: true
        });
    }

    updateAddress() {
        this.setState({
            addressModalIsOpen: true
        });
    }

    disableUpdateAddressBtn() {
        this.setState({
            addressButtonIsActive: false
        })
    }

    enableUpdateAddressBtn(props) {
        // transform coords
        let newCoords = '(' + props.coords.lat + ', ' + props.coords.lng + ')'
        this.setState({
            addressButtonIsActive: true,
            latlng: props.coords,
            incident: update(this.state.incident, {
                address: { $set: props.address },
                coords: { $set: newCoords }
            })
        })
    }

    putIncident(newIncident) {
        this.setState({
            spinnerIsOpen: true
        })
        let data = JSON.stringify({
            coords: newIncident.coords,
            address: newIncident.address,
            ownersFirstName: newIncident.ownersFirstName,
            ownersLastName: newIncident.ownersLastName,
            ownersTelephoneNumber: newIncident.ownersTelephoneNumber,
            reasonForVisit: newIncident.reasonForVisit,
            pghCode: newIncident.pghCode,
            citationNumber: newIncident.citationNumber,
            comments: newIncident.comments,
            callOrigin: newIncident.callOrigin,
            officerInitials: newIncident.officerInitials,
            open: newIncident.open,
            note: newIncident.note,
            zip: newIncident.zip,
            itemId: newIncident.itemId
        })
        let cleaned_data = data.replace(/'/g, '')
        fetch('/api/incidents/put', {
            method: 'POST',
            body: cleaned_data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                location.reload()
            })
    }

    putNewAddress() {
        this.putIncident(this.state.incident)
    }

    throwSpinner() {
        this.setState({
            spinnerIsOpen: true
        });
    }

    closeIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'No' } })
        }, function (this) {
            this.putIncident(this.state.incident)
        })
    }

    openIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'Yes' } })
        }, function (this) {
            this.putIncident(this.state.incident)
        })
    }

    public render() {
        const {
            latlng,
            incident,
            animals,
            addressModalIsOpen,
            addressButtonIsActive,
            incidentModalIsOpen,
            spinnerIsOpen } = this.state

        const EnableAddressBtn =
            addressButtonIsActive == true

        if (incident.coords) {
            var coords = incident.coords.replace('(', '').replace(')', '');;
            var url = 'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + coords + '&fov=60&heading=235&pitch=10&key=AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4'
        }
        else {
            var url = '../images/image-placeholder.png'
        }

        return (
            <div>
                {!spinnerIsOpen == true &&
                    <div>
                        <h3 className='text-center'><strong>{incident.address}</strong></h3>
                        {incident.open == 'Yes' &&
                            <h4 className='text-center' style={red}>Open incident</h4>
                        }
                        {incident.open == 'No' &&
                            <h4 className='text-center'>Closed incident</h4>
                        }
                        <h5 className='text-center'>Incident ID: {incident.itemId}</h5>
                        <br />
                        <div className='row'>
                            <div className='col-md-12'>
                                <button className='btn btn-link' onClick={this.updateAddress.bind(this)}>Change address</button>
                                <button className='btn btn-link' onClick={this.updateIncident.bind(this)}>Edit incident</button>
                                {incident.open == 'Yes' &&
                                    <button className='btn btn-link' onClick={this.closeIncident.bind(this)}>Close incident</button>
                                }
                                {incident.open == 'No' &&
                                    <button className='btn btn-link' onClick={this.openIncident.bind(this)}>Reopen incident</button>
                                }
                            </div>
                            <div className='col-lg-6 col-md-12'>
                                <Incident incident={incident} />
                            </div>
                            <div className='col-md-6 hidden-md hidden-sm hidden-xs'>
                                <div className='row text-center' style={padding}>
                                    <img style={imgStyle} src={url} />
                                </div>
                                <div className='row' style={padding}>
                                    <Map coords={latlng} />
                                </div>
                            </div>
                        </div>
                        <div className='reportcomments'>
                            <h3>Comments:</h3>
                            <div style={lineBreaks}>{incident.comments}</div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <AnimalsTable
                                    throwSpinner={this.throwSpinner.bind(this)}
                                    incidentID={incident.uuid}
                                    address={incident.address}
                                    coords={latlng} 
                                    animals={animals} />
                            </div>
                        </div>
                        {/* update incident modal */}
                        <Modal
                            open={incidentModalIsOpen}
                            onClose={this.closeModal.bind(this)}
                            closeOnEsc={false}
                            classNames={{
                                overlay: 'custom-overlay',
                                modal: 'custom-modal'
                            }}
                            center>
                            <div>
                                <h3 className='text-center'>Update incident</h3>
                                <UpdateIncident putIt={this.putIncident.bind(this)} incident={incident} put={true} />
                            </div>
                        </Modal>
                        {/* update address modal */}
                        <Modal
                            open={addressModalIsOpen}
                            onClose={this.closeModal.bind(this)}
                            closeOnEsc={false}
                            classNames={{
                                overlay: 'custom-overlay',
                                modal: 'custom-modal'
                            }}
                            center>
                            <div>
                                <UpdateAddress enableButton={this.enableUpdateAddressBtn.bind(this)} disableButton={this.disableUpdateAddressBtn.bind(this)} incident={incident} />
                                <div className='col-md-12 text-center'>
                                    <button disabled={!EnableAddressBtn} onClick={this.putNewAddress.bind(this)} className='btn btn-success'>Save</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                }
                {/* loading spinner */}
                <Modal
                    open={spinnerIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'spinner-overlay',
                        modal: 'spinner-modal'
                    }}
                    animationDuration={1000}
                    closeOnEsc={false}
                    closeOnOverlayClick={false}
                    showCloseIcon={false}
                    center>
                    <div className="loader"></div>
                    ...loading incident report...
                </Modal>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.incidents,
        ...state.dropdowns
    }),
    ({
        ...Ping.actionCreators,
        ...Incidents.actionCreators,
        ...Incidents.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Report as any) as typeof Report;