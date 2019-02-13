import * as React from 'react'
import { Redirect } from 'react-router-dom'
import Input from '../../formElements/input'
import Select from '../../formElements/select'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as user from '../../../store/user'
import * as Dropdowns from '../../../store/dropdowns'
import * as types from '../../../store/types'
import * as constants from '../constants'
import { selected, update } from '../functions/handleMulti'
import Submit from '../markup/submit'
import postIncident from '../functions/post'
import putIncident from '../functions/put'
import Spinner from '../../utilities/spinner'

type props = {
    incident: types.incident
    put: boolean
    coords: any
    address: string
    incidentUUID: string
    user: types.user
}

type state = {
    originOptions: Array<any>
    reasonOptions: Array<any>
    codeOptions: Array<any>
    initialsOptions: Array<any>
    ownersLastName: string
    ownersFirstName: string
    ownersTelephoneNumber: string
    callOrigin: string
    reasonForVisit: string
    pghCode: string
    citationNumber: string
    officerInitials: string
    note: string
    open: string
    address: string
    coords: string
    itemId: string
    redirect: boolean
    spinnerIsOpen: boolean
}

export class Incident extends React.Component<any, state> {
    constructor(props) {
        super(props)
        this.state = {
            // dropdowns
            originOptions: constants.loadingOptions,
            reasonOptions: constants.loadingOptions,
            codeOptions: constants.loadingOptions,
            initialsOptions: constants.loadingOptions,
            redirect: false,
            spinnerIsOpen: false,

            ownersLastName: '',
            ownersFirstName: '',
            ownersTelephoneNumber: '',
            callOrigin: '',
            reasonForVisit: '',
            pghCode: '',
            citationNumber: '',
            officerInitials: '',
            note: '',
            open: '',
            address: '',
            coords: '',
            itemId: ''
        }
    }

    componentDidMount() {
        this.props.getDropdowns()
        const incident = this.props.incident
        if (this.props.put == true) {
            this.setState({
                ownersLastName: incident.ownersLastName || '',
                ownersFirstName: incident.ownersFirstName || '',
                ownersTelephoneNumber: incident.ownersTelephoneNumber || '',
                callOrigin: incident.callOrigin || '',
                reasonForVisit: incident.reasonForVisit || '',
                pghCode: incident.pghCode || '',
                citationNumber: incident.citationNumber || '',
                officerInitials: incident.officerInitials || '',
                note: incident.note || '',
                open: incident.open || '',
                address: incident.address || '',
                coords: incident.coords || '',
                itemId: incident.itemId || ''
            })
        }
        if (this.props.put != true) {
            this.setState({
                open: 'Yes'
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            if (this.props.submit != nextProps.submit) {
                // trigger post
                if (nextProps.submit == true) {
                    this.postNewIncident()
                }
            }
            // set dropdowns
            var futureOrigin: any[] = []
            var futureReason: any[] = []
            var futureCode: any[] = []
            var futureInitials: any[] = []
            nextProps.dropdowns.callOrigins.forEach(function (element) {
                var json = { "value": element.origin, "label": element.origin, "name": 'callOrigin' };
                futureOrigin.push(json)
            })
            nextProps.dropdowns.reasonsForVisit.forEach(function (element) {
                var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
                futureReason.push(json)
            })
            nextProps.dropdowns.citationNumbers.forEach(function (element) {
                var json = { "value": element.citation, "label": element.citation, "name": 'citationNumber' };
                futureCode.push(json)
            })
            nextProps.dropdowns.officerInitials.forEach(function (element) {
                var json = { "value": element.initial, "label": element.initial, "name": 'officerInitials' };
                futureInitials.push(json)
            })
            this.setState({
                originOptions: futureOrigin,
                reasonOptions: futureReason,
                codeOptions: futureCode,
                initialsOptions: futureInitials
            })
        }
    }

    put() {
        this.props.putIt(this.state)
    }

    async postNewIncident() {
        let data = JSON.stringify({
            AddressID: '(' + this.props.coords.lat + ', ' + this.props.coords.lng + ')',
            Address: this.props.address,
            OwnersFirstName: this.state.ownersFirstName,
            OwnersLastName: this.state.ownersLastName,
            OwnersTelephone: this.state.ownersTelephoneNumber,
            ReasonforVisit: this.state.reasonForVisit,
            ADVPGHCode: this.state.pghCode,
            CitationNumber: this.state.citationNumber,
            CallOrigin: this.state.callOrigin,
            Officers: this.state.officerInitials,
            Open: this.state.open,
            Note: this.state.note,
            AdvisoryID: this.props.incidentUUID,
            ModifiedBy: this.props.user.email,
            SubmittedBy: this.props.user.email
        })
        const cleaned_data = data.replace(/'/g, '')
        const success = await postIncident(cleaned_data)
        if (success) this.setState({ redirect: true })
    }

    public render() {
        // state
        const {
            // select options
            originOptions,
            reasonOptions,
            codeOptions,
            initialsOptions,
            ownersLastName,
            ownersFirstName,
            ownersTelephoneNumber,
            callOrigin,
            reasonForVisit,
            pghCode,
            citationNumber,
            officerInitials,
            note,
            open,
            redirect,
            spinnerIsOpen
        } = this.state

        // validation
        const isEnabled =
            reasonForVisit != '' &&
            Object.keys(this.props.coords).length > 0

        if (redirect) {
            const destination = '/Report/id=' + this.props.incidentUUID
            return <Redirect to={destination} />
        }

        return (
            <div>
                <div className='col-md-6'>
                    <Input
                        value={ownersFirstName}
                        header="Owner's first name"
                        placeholder="First name"
                        callback={e => this.setState({ ownersFirstName: e.target.value })}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={ownersLastName}
                        header="Owner's last name"
                        placeholder="Last name"
                        callback={e => this.setState({ ownersLastName: e.target.value })}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={ownersTelephoneNumber}
                        header="Owner's telephone number"
                        placeholder="Telephone number"
                        callback={e => this.setState({ ownersTelephoneNumber: e.target.value })}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={callOrigin ? { value: callOrigin, label: callOrigin } : ''}
                        header='Call Origin'
                        placeholder='Select origin...'
                        onChange={v => this.setState({ callOrigin: v.value })}
                        multi={false}
                        options={originOptions}
                    />
                </div>
                <div className='col-md-12'>
                    <Select
                        value={reasonForVisit ? selected(reasonForVisit) : ''}
                        header='Reason(s) for visit'
                        placeholder='Select reason(s)...'
                        onChange={reasonForVisit => this.setState({ reasonForVisit: update(reasonForVisit) })}
                        multi={true}
                        options={reasonOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={pghCode ? selected(pghCode) : ''}
                        header='Code(s)'
                        placeholder='Select code(s)...'
                        onChange={pghCode => this.setState({ pghCode: update(pghCode) })}
                        multi={true}
                        options={codeOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={citationNumber}
                        header="Citation number"
                        placeholder="Citation"
                        callback={e => this.setState({ citationNumber: e.target.value })}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={officerInitials ? selected(officerInitials) : ''}
                        header='Officers involved'
                        placeholder='Select initials...'
                        onChange={officerInitials => this.setState({ officerInitials: update(officerInitials) })}
                        multi={true}
                        options={initialsOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={note}
                        header="Note"
                        placeholder="Quick reference"
                        maxLength={30}
                        callback={e => this.setState({ note: e.target.value })}
                    />
                </div>
                {this.props.put != true &&
                    <div className='col-md-12'>
                        <Select
                            value={open ? { value: open, label: open } : ''}
                            header='Keep open?'
                            placeholder='Yes or no...'
                            onChange={v => this.setState({ open: v.value })}
                            multi={false}
                            options={constants.openOptions}
                        />
                    </div>
                }
                {this.props.put == true &&
                    <Submit
                        isEnabled={isEnabled}
                        fireSubmit={this.put.bind(this)}
                    />
                }
                {this.props.put == false &&
                    <Submit
                        isEnabled={isEnabled}
                        fireSubmit={this.postNewIncident.bind(this)}
                    />
                }
                {spinnerIsOpen &&
                    <Spinner notice='...submitting incident...' />
                }
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
)(Incident)