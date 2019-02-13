import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import Incident from './markup/incident'
import { v1 as uuid } from 'uuid'
import * as constants from './constants'
import Spinner from '../utilities/spinner'
import Address from './markup/address'
import Submit from './markup/submit'

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
    redirect: boolean
    isEnabled: boolean
}

export class SubmitIncident extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            map: false,
            address: '',
            coords: {},
            submit: false,
            spinnerIsOpen: false,
            redirect: false,

            // validation
            formValid: false,
            isEnabled: false
        }
        this.postComplete = this.postComplete.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        // generate uuid for new incident/animals
        const guid: string = uuid()
        this.setState({
            uuid: guid
        })
    }

    fireSubmit() {
        this.setState({
            submit: true,
            spinnerIsOpen: true
        })
    }

    postComplete() {
        this.setState ({
            redirect: true
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
            isEnabled
        } = this.state

        if (redirect) {
            return <Redirect to='/' />
        }

        return (
            <div className='col-md-8 col-md-offset-2'>
                <Address
                    address={address}
                    map={map}
                    coords={coords}
                    setState={this.setState.bind(this)}
                />
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
                <Submit
                    isEnabled={isEnabled}
                    fireSubmit={this.fireSubmit.bind(this)}
                />
                {spinnerIsOpen &&
                    <Spinner notice='...submitting incident...' />
                }
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
)(SubmitIncident)