import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as user from '../../store/user'
import * as types from '../../store/types'
import Incident from './markup/incident'
import { v1 as uuid } from 'uuid'
import * as constants from './constants'
import Address from './markup/address'

type props = {
    getDropdowns: () => void
    dropdowns: types.dropdowns
    user: types.user
}

type state = {
    uuid: string
    map: boolean
    address: string
    coords: object
}

export class SubmitIncident extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            map: false,
            address: '',
            coords: {},
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        // generate uuid for new incident/animals
        const guid: string = uuid()
        this.setState({
            uuid: guid
        })
    }

    public render() {
        const {
            uuid,
            map,
            address,
            coords
        } = this.state

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
                        getDropdowns={this.props.getDropdowns.bind(this)}
                        dropdowns={this.props.dropdowns}
                        user={this.props.user}
                        incidentUUID={uuid}
                        address={address}
                        coords={coords}
                        put={false}
                        ownersLastName={undefined}
                        ownersFirstName={undefined}
                        ownersTelephoneNumber={undefined}
                        callOrigin={undefined}
                        comments={undefined}
                        reasonForVisit={undefined}
                        pghCode={undefined}
                        citationNumber={undefined}
                        officerInitials={undefined}
                        note={undefined}
                        open={undefined}
                        itemId={undefined}
                        submittedBy={undefined}
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.dropdowns,
        ...state.user
    }),
    ({
        ...Dropdowns.actionCreators,
        ...user.actionCreators
    })
)(SubmitIncident)