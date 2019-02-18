import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as User from '../../store/user'
import * as Incidents from '../../store/incidents'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import Incident from './markup/incident'
import AnimalsTable from './markup/animals'
import Map from '../map/mapContainer'
import UpdateIncident from '../submitIncident/markup/updateIncident'
import UpdateAddress from '../submitIncident/markup/updateAddress'
import update from 'immutability-helper'
import getIncident from './functions/getIncident'
import getAnimals from './functions/getAnimals'
import formatLatLng from './functions/formatLatLng'
import Loading from '../incidents/markup/loading'
import Comments from '../comments'
import StreetView from './markup/streetView'
import Header from './markup/header'
import Buttons from './markup/buttons'
import DocumentTitle from 'react-document-title'
import Images from '../images'
import putIncident from '../submitIncident/functions/putIncident'
import formatSPLoad from './functions/formatUpdateforSP'

// keep original latlng & incident objects in case user bails from updates
let lat_lng = {} as any
let originalIncident = {} as any

type props = {
    user: types.user
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

    closeIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'No' } })
        }, () => {
            putIncident(JSON.stringify(formatSPLoad(this.state.incident, this.props.user)).replace(/'/g, ''))
        })
    }

    openIncident() {
        this.setState({
            incident: update(this.state.incident, { open: { $set: 'Yes' } })
        }, () => {
            putIncident(JSON.stringify(formatSPLoad(this.state.incident, this.props.user)).replace(/'/g, ''))
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
            spinnerIsOpen,
            incidentNotFound
        } = this.state

        const EnableAddressBtn =
            addressButtonIsActive == true

        if (incidentNotFound == true) {
            return <Redirect push to='/Error' />
        }

        return (
            <DocumentTitle title={incident ? incident.address : '...loading...'}>
                <div>
                    {!spinnerIsOpen == true &&
                        <div className='col-md-8 col-md-offset-2'>
                            <Header incident={incident} />
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
                                user={this.props.user}
                                incident={incident}
                            />
                            <AnimalsTable
                                throwSpinner={() => this.setState({ spinnerIsOpen: true })}
                                incidentID={incident.uuid}
                                address={incident.address}
                                coords={latlng}
                                animals={animals} />
                            <Images
                                incident={incident}
                            />

                            <UpdateIncident
                                incidentModalIsOpen={incidentModalIsOpen}
                                incident={incident}
                                closeModal={this.closeModal.bind(this)}
                                getDropdowns={this.props.getDropdowns.bind(this)}
                                dropdowns={this.props.dropdowns}
                                user={this.props.user}
                            />

                            <UpdateAddress
                                addressModalIsOpen={addressModalIsOpen}
                                enableAddressButton={EnableAddressBtn}
                                closeModal={this.closeModal.bind(this)}
                                disableButton={() => this.setState({ addressButtonIsActive: false })}
                                enableButton={this.enableUpdateAddressBtn.bind(this)}
                                putIncident={() => {
                                    putIncident(JSON.stringify(formatSPLoad(this.state.incident, this.props.user)).replace(/'/g, ''))
                                    this.setState({ addressModalIsOpen: false })
                                }}
                            />
                        </div>
                    }
                    {spinnerIsOpen == true &&
                        <Loading notice='...loading incident...' />
                    }
                </div>
            </DocumentTitle>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.incidents,
        ...state.dropdowns,
        ...state.user
    }),
    ({
        ...Incidents.actionCreators,
        ...Dropdowns.actionCreators,
        ...User.actionCreators
    })
)(Report as any)