import * as React from 'react'
import Modal from 'react-responsive-modal'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Incidents from '../../store/incidents'
import * as Dropdowns from '../../store/dropdowns'
import Incident from './markup/incident'
import AnimalsTable from './markup/animals'
import Map from '../map/mapContainer'
import UpdateIncident from '../submit/incident'
import UpdateAddress from './markup/updateAddress'
import update from 'immutability-helper'
import * as style from './constants'
import getIncident from './functions/getIncident'
import getAnimals from './functions/getAnimals'
import formatLatLng from './functions/formatLatLng'
import putIncident from './functions/putIncident'
import Loading from '../incidents/markup/loading'
const placeholder = require('../../images/image-placeholder.png')

// keep original latlng & incident objects in case user bails from updates
let lat_lng = {} as any
let originalIncident = {} as any

export class Report extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            addressModalIsOpen: false,
            addressButtonIsActive: true,
            incidentModalIsOpen: false,
            spinnerIsOpen: true,
            incident: {},
            animals: [],
            latlng: {},
            incidentNotFound: false
        }
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        originalIncident = await getIncident(this.props.match.params.id)
        lat_lng = formatLatLng(originalIncident)
        this.setState({
            animals: await getAnimals(this.props.match.params.id),
            incident: originalIncident,
            latlng: lat_lng,
            addressModalIsOpen: false,
            incidentModalIsOpen: false,
            spinnerIsOpen: false,
        })

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
        putIncident(newIncident)
    }

    closeIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'No' } })
        }, () => putIncident(this.state.incident))
    }

    openIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'Yes' } })
        }, () => putIncident(this.state.incident))
    }

    public render() {
        const {
            latlng,
            incident,
            animals,
            addressModalIsOpen,
            addressButtonIsActive,
            incidentModalIsOpen,
            spinnerIsOpen,
            incidentNotFound } = this.state

        const EnableAddressBtn =
            addressButtonIsActive == true

        if (incident.coords) {
            var coords = incident.coords.replace('(', '').replace(')', '');;
            var url = 'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + coords + '&fov=60&heading=235&pitch=10&key=AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4'
        }
        else {
            var url = placeholder as string
        }

        if (incidentNotFound == true) {
            return <Redirect push to='/NotFound' />
        }

        return (
            <div>
                {!spinnerIsOpen == true &&
                    <div className='col-md-8 col-md-offset-2'>
                        <h3 className='text-center'><strong>{incident.address}</strong></h3>
                        {incident.open == 'Yes' &&
                            <h4 className='text-center' style={style.red}>Open incident</h4>
                        }
                        {incident.open == 'No' &&
                            <h4 className='text-center'>Closed incident</h4>
                        }
                        <h5 className='text-center'>Incident ID: {incident.itemId}</h5>
                        <br />
                        <div className='row'>
                            <div className='col-md-12 text-center'>
                                <button className='btn btn-secondary' onClick={() => this.setState({ addressModalIsOpen: true })}>Change address</button>
                                <button className='btn btn-secondary' onClick={() => this.setState({ incidentModalIsOpen: true })}>Edit incident</button>
                                {incident.open == 'Yes' &&
                                    <button className='btn btn-secondary' onClick={this.closeIncident.bind(this)}>Close incident</button>
                                }
                                {incident.open == 'No' &&
                                    <button className='btn btn-secondary' onClick={this.openIncident.bind(this)}>Reopen incident</button>
                                }
                                <br />
                            </div>
                            <div className='col-lg-6 col-md-12'>
                                <Incident incident={incident} />
                            </div>
                            <div className='col-md-6 hidden-md hidden-sm hidden-xs'>
                                <div className='row text-center' style={style.padding}>
                                    <img style={style.imgStyle} src={url} />
                                </div>
                                <div className='row' style={style.padding}>
                                    <Map coords={latlng} />
                                </div>
                            </div>
                        </div>
                        <div className='reportcomments'>
                            <h3>Comments:</h3>
                            <div style={style.lineBreaks}>{incident.comments}</div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <AnimalsTable
                                    throwSpinner={() => this.setState({ spinnerIsOpen: true })}
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
                                <UpdateAddress enableButton={this.enableUpdateAddressBtn.bind(this)} disableButton={() => this.setState({ addressButtonIsActive: false })} incident={incident} />
                                <div className='col-md-12 text-center'>
                                    <button disabled={!EnableAddressBtn} onClick={() => putIncident(this.state.incident)} className='btn btn-success'>Save</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                }
                {spinnerIsOpen == true &&
                    <Loading />
                }
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.incidents,
        ...state.dropdowns
    }),
    ({
        ...Incidents.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Report as any)