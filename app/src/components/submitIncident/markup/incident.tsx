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
    destination: string
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
            destination: '',
            spinnerIsOpen: false,

            // incident state
            ownersLastName: props.ownersLastName || '',
            ownersFirstName: props.ownersFirstName || '',
            ownersTelephoneNumber: props.ownersTelephoneNumber || '',
            callOrigin: props.callOrigin || '',
            reasonForVisit: props.reasonForVisit || '',
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
        setDropdowns(this.props.dropdowns, this.setState.bind(this))
    }

    componentWillReceiveProps(nextProps) {
        setDropdowns(nextProps.dropdowns, this.setState.bind(this))
    }

    async putPost() {
        let data: any = {
            AddressID: this.props.put ? this.props.coords : '(' + this.props.coords.lat + ', ' + this.props.coords.lng + ')',
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
        }
        if (this.props.put) {
            data.Id = this.state.itemId
            const success = await putIncident(JSON.stringify(data).replace(/'/g, ''))
            if (success) { location.reload() } else { this.failure() }
        } else {
            const success = await postIncident(JSON.stringify(data).replace(/'/g, ''))
            if (success) { this.success() } else { this.failure() }
        }
    }

    success() {
        this.setState({
            redirect: true,
            destination: '/Report/id=' + this.props.incidentUUID
        })
    }

    failure() {
        this.setState({
            redirect: true,
            destination: '/Error'
        })
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
            destination,
            spinnerIsOpen
        } = this.state

        // validation
        const isEnabled =
            reasonForVisit != '' &&
            Object.keys(this.props.coords).length > 0

        if (redirect) {
            return <Redirect push to={destination} />
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
                <Submit
                    saveObject="incident"
                    isEnabled={isEnabled}
                    fireSubmit={this.putPost.bind(this)}
                />
                {spinnerIsOpen &&
                    <Spinner notice='...submitting incident...' />
                }
            </div>
        )
    }
}