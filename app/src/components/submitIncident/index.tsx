import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import Incident from './markup/incident'
import Modal from 'react-responsive-modal'
import Autocomplete from '../formElements/autocomplete'
import Map from '../map/mapContainer'
import { v1 as uuid } from 'uuid'
import * as constants from './constants'
import Spinner from '../utilities/spinner'

type props = {
    getDropdowns: () => void
    dropdowns: types.dropdowns
}

type state = {
    uuid: string
    map: boolean
    address: string
    coords: object
    submit: boolean
    spinnerIsOpen: boolean
    formValid: boolean
    countPostedItems: number
    redirect: boolean
    buttonIsEnabled: boolean
    validationCount: number
}

export class Submit extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            map: false,
            address: '',
            coords: {},
            submit: false,
            spinnerIsOpen: false,
            formValid: false,
            countPostedItems: 0,
            redirect: false,

            // validation
            buttonIsEnabled: false,
            validationCount: 0
        }
        this.postComplete = this.postComplete.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        // generate uuid for new incident/animals
        const guid: string = uuid()
        this.setState({
            uuid: guid
        })
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

    fireSubmit() {
        this.setState({
            // this triggrs post on child incident component
            submit: true,
            spinnerIsOpen: true
        })
    }

    postComplete() {
        this.setState({
            countPostedItems: this.state.countPostedItems + 1
        }, function (this) {
            this.redirect()
        })
    }

    public render() {
        const {
            uuid,
            map,
            address,
            coords,
            submit,
            spinnerIsOpen,
            redirect,
            buttonIsEnabled
        } = this.state

        if (redirect) {
            return <Redirect to='/' />
        }

        return (
            <div className='col-md-8 col-md-offset-2'>
                <h3>Address</h3>
                <hr />
                <div className='row' style={constants.sectionPadding}>
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
                <h3>Description</h3>
                <hr />
                <div className='row' style={constants.sectionPadding}>
                    <Incident
                        incidentUUID={uuid}
                        address={address}
                        coords={coords}
                        submit={submit}
                        postComplete={this.postComplete} />
                </div>
                <div className='col-md-12 text-center'>
                    <button disabled={!buttonIsEnabled} onClick={this.fireSubmit.bind(this)} className="btn btn-success">Save</button>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                <Spinner notice='...submitting incident...' />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.dropdowns
    }),
    ({
        ...Dropdowns.actionCreators
    })
)(Submit)