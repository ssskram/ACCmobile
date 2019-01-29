import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Incidents from '../../store/incidents'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import Incident from './markup/incident'
import AnimalsTable from './markup/animals'
import Map from '../map/mapContainer'
import UpdateIncident from './markup/updateIncident'
import UpdateAddress from './markup/updateAddress'
import update from 'immutability-helper'
import getIncident from './functions/getIncident'
import getAnimals from './functions/getAnimals'
import formatLatLng from './functions/formatLatLng'
import putIncident from './functions/putIncident'
import Loading from '../incidents/markup/loading'
import Comments from './markup/comments'
import StreetView from './markup/streetView'
import Header from './markup/header'
import Buttons from './markup/buttons'

// keep original latlng & incident objects in case user bails from updates
let lat_lng = {} as any
let originalIncident = {} as any

type props = {
    incidents: types.incident[]
    dropdowns: types.dropdowns
    getDropdowns: () => void
    getIncidents: () => void
    match: any // query params
}

type state = {
    addressModalIsOpen: boolean,
    addressButtonIsActive: boolean,
    incidentModalIsOpen: boolean,
    spinnerIsOpen: boolean,
    incident: types.incident,
    animals: Array<any>,
    latlng: object,
    incidentNotFound: boolean
}

export class Report extends React.Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            addressModalIsOpen: false,
            addressButtonIsActive: true,
            incidentModalIsOpen: false,
            spinnerIsOpen: true,
            incident: undefined,
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

        if (incidentNotFound == true) {
            return <Redirect push to='/NotFound' />
        }

        return (
            <div>
                {!spinnerIsOpen == true &&
                    <div className='col-md-8 col-md-offset-2'>
                        <Header incident={incident}/>
                        <div className='row'>
                            <Buttons 
                                incident={incident}
                                setState={this.setState.bind(this)}
                                closeIncident={this.closeIncident.bind(this)}
                                openIncident={this.openIncident.bind(this)}
                            />
                            <Incident incident={incident} />
                            <div className='col-md-6 hidden-md hidden-sm hidden-xs'>
                                <StreetView incident={incident} />
                                <Map coords={latlng} />
                            </div>
                        </div>
                        <Comments
                            incident={incident}
                        />
                        <AnimalsTable
                            throwSpinner={() => this.setState({ spinnerIsOpen: true })}
                            incidentID={incident.uuid}
                            address={incident.address}
                            coords={latlng}
                            animals={animals} />

                        <UpdateIncident
                            incidentModalIsOpen={incidentModalIsOpen}
                            incident={incident}
                            closeModal={this.closeModal.bind(this)}
                            putIncident={() => this.putIncident.bind(this)}
                        />
                        <UpdateAddress
                            addressModalIsOpen={addressModalIsOpen}
                            enableAddressButton={EnableAddressBtn}
                            closeModal={this.closeModal.bind(this)}
                            disableButton={() => this.setState({ addressButtonIsActive: false })}
                            enableButton={this.enableUpdateAddressBtn.bind(this)}
                            putIncident={() => putIncident(this.state.incident)}
                        />
                    </div>
                }
                {spinnerIsOpen == true &&
                    <Loading />
                }
            </div>
        )
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