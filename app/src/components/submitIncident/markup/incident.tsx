import * as React from 'react'
import { Redirect } from 'react-router-dom'
import Input from '../../formElements/input'
import Select from '../../formElements/select'
import * as constants from '../constants'
import * as types from '../../../store/types'
import { selected, update } from '../functions/handleMulti'
import Submit from '../markup/submit'
import postIncident from '../functions/postIncident'
import putIncident from '../functions/putIncident'
import setDropdowns from '../functions/setDropdowns'
import Spinner from '../../utilities/spinner'

type props = {
    getDropdowns: () => void
    dropdowns: types.dropdowns
    user: types.user
    put: boolean
    
    // incoming incident state
    incidentUUID: string
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
    coords: any
    itemId: number
}

type state = {
    // dropdowns
    originOptions: Array<any>
    reasonOptions: Array<any>
    codeOptions: Array<any>
    initialsOptions: Array<any>

    // utilities
    redirect: boolean
    spinnerIsOpen: boolean

    // internal incident state
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
}

export default class Incident extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            originOptions: constants.loadingOptions,
            reasonOptions: constants.loadingOptions,
            codeOptions: constants.loadingOptions,
            initialsOptions: constants.loadingOptions,
            redirect: false,
            spinnerIsOpen: false,

            // incident state
            ownersLastName: props.ownersLastName || '',
            ownersFirstName: props.ownersFirstName || '',
            ownersTelephoneNumber: props.ownersTelephoneNumber || '',
            callOrigin: props.callOrigin || '',
            reasonForVisit: props.callOrigin || '',
            pghCode: props.pghCode || '',
            citationNumber: props.citationNumber || '',
            officerInitials: props.officerInitials || '',
            note: props.note || '',
            open: props.open || 'Yes',
            address: props.address || '',
            coords: props.coords || '',
            itemId: props.itemId || ''
        }
    }

    componentDidMount() {
        this.props.getDropdowns()
    }

    componentWillReceiveProps(nextProps) {
        setDropdowns(nextProps.dropdowns, this.setState.bind(this))
    }

    put() {
        // this.props.putIt(this.state)
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