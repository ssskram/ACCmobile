import * as React from 'react';
import Input from '../formElements/input'
import Select from '../formElements/select'
import Textarea from '../formElements/textarea'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as user from '../../store/user'
import * as Dropdowns from '../../store/dropdowns'
import * as constants from './constants'

export class Incident extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // dropdowns
            originOptions: constants.loadingOptions,
            reasonOptions: constants.loadingOptions,
            codeOptions: constants.loadingOptions,
            initialsOptions: constants.loadingOptions,

            ownersLastName: '',
            ownersFirstName: '',
            ownersTelephoneNumber: '',
            callOrigin: '',
            reasonForVisit: '',
            pghCode: '',
            citationNumber: '',
            officerInitials: '',
            comments: '',
            note: '',
            open: '',
            address: '',
            coords: '',
            itemId: ''
        }
        this.postNewIncident = this.postNewIncident.bind(this);
    }

    componentDidMount() {
        this.props.getDropdowns()
        let incident = this.props.incident
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
                comments: incident.comments || '',
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

    componentWillUpdate(nextProps, nextState) {
        if (this.props.put != true) {
            if (this.state.reasonForVisit == '' && nextState.reasonForVisit != '') {
                this.props.isValid()
            }
            if (this.state.open == '' && nextState.open != '') {
                this.props.isValid()
            }
            if (this.state.reasonForVisit != '' && nextState.reasonForVisit == '') {
                this.props.isNotValid()
            }
            if (this.state.open != '' && nextState.open == '') {
                this.props.isNotValid()
            }
        }
    }



    put() {
        this.props.putIt(this.state)
    }

    postNewIncident() {
        let self = this
        let data = JSON.stringify({
            AddressID: '(' + this.props.coords.lat + ', ' + this.props.coords.lng + ')',
            Address: this.props.address,
            OwnersFirstName: this.state.ownersFirstName,
            OwnersLastName: this.state.ownersLastName,
            OwnersTelephone: this.state.ownersTelephoneNumber,
            ReasonforVisit: this.state.reasonForVisit.value,
            ADVPGHCode: this.state.pghCode,
            CitationNumber: this.state.citationNumber,
            Comments: this.state.comments,
            CallOrigin: this.state.callOrigin,
            Officers: this.state.officerInitials,
            Open: this.state.open,
            Note: this.state.note,
            AdvisoryID: this.props.incidentUUID,
            ModifiedBy: this.props.user.email,
            SubmittedBy: this.props.user.email
        })
        let cleaned_data = data.replace(/'/g, '')
        fetch('http://localhost:3000/accmobile/addIncident', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
                'Content-Type': 'application/json'
            }),
            body: cleaned_data,
        })
            .then(function () {
                self.props.postComplete()
            })
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
            comments,
            note,
            open
        } = this.state

        // validation
        const isEnabled =
            reasonForVisit != ''

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
                        value={reasonForVisit ? reasonForVisit : ''}
                        header='Reason(s) for visit'
                        placeholder='Select reason(s)...'
                        onChange={reasonForVisit => this.setState({ reasonForVisit })}
                        multi={true}
                        options={reasonOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={pghCode ? { value: pghCode, label: pghCode } : ''}
                        header='Code(s)'
                        placeholder='Select code(s)...'
                        onChange={v => this.setState({ pghCode: v.value })}
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
                <div className='col-md-12'>
                    <Textarea
                        value={comments}
                        header="Comments"
                        placeholder="Describe the incident"
                        callback={e => this.setState({ comments: e.target.value })}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={officerInitials ? { value: officerInitials, label: officerInitials } : ''}
                        header='Officers involved'
                        placeholder='Select initials...'
                        onChange={v => this.setState({ officerInitials: v.value })}
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
                    <div className='col-md-12 text-center'>
                        <button disabled={!isEnabled} onClick={this.put.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
            </div>
        );
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