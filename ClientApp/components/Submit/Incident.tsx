import * as React from 'react';
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import Textarea from '../FormElements/textarea'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'

const loadingOptions = [{
    "value": '...loading...',
    "label": '...loading...'
}]

const openOptions = [
    { value: 'Yes', label: 'Yes', name: 'open' },
    { value: 'No', label: 'No', name: 'open' },
]

export class Incident extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // dropdowns
            originOptions: loadingOptions,
            reasonOptions: loadingOptions,
            codeOptions: loadingOptions,
            initialsOptions: loadingOptions,

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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            // trigger post
            if (nextProps.submit == true) {
                this.postNewIncident()
            }

            // set dropdowns
            var futureOrigin: any[] = []
            var futureReason: any[] = []
            var futureCode: any[] = []
            var futureInitials: any[] = []
            nextProps.callOrigins.forEach(function (element) {
                var json = { "value": element.origin, "label": element.origin, "name": 'callOrigin' };
                futureOrigin.push(json)
            })
            nextProps.reasonsForVisit.forEach(function (element) {
                var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
                futureReason.push(json)
            })
            nextProps.citationNumbers.forEach(function (element) {
                var json = { "value": element.citation, "label": element.citation, "name": 'citationNumber' };
                futureCode.push(json)
            })
            nextProps.officerInitials.forEach(function (element) {
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

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    handleReasonMulti(value) {
        this.setState({ reasonForVisit: value })
    };

    handleCodeMulti(value) {
        this.setState({ pghCode: value })
    };

    handleInitialMulti(value) {
        this.setState({ officerInitials: value })
    };

    put() {
        this.props.putIt(this.state)
    }

    postNewIncident() {
        let self = this
        let data = JSON.stringify({
            coords: '(' + this.props.coords.lat + ', ' + this.props.coords.lng + ')',
            address: this.props.address,
            ownersFirstName: this.state.ownersFirstName,
            ownersLastName: this.state.ownersLastName,
            ownersTelephoneNumber: this.state.ownersTelephoneNumber,
            reasonForVisit: this.state.reasonForVisit,
            pghCode: this.state.pghCode,
            citationNumber: this.state.citationNumber,
            comments: this.state.comments,
            callOrigin: this.state.callOrigin,
            officerInitials: this.state.officerInitials,
            open: this.state.open,
            note: this.state.note,
            zip: this.state.zip,
            uuid: this.props.incidentUUID
        })
        let cleaned_data = data.replace(/'/g, '')
        fetch('/api/incidents/post', {
            method: 'POST',
            body: cleaned_data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                self.props.postComplete()
            });
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

        return (
            <div className='col-md-12'>
                <div className='col-md-6'>
                    <Input
                        value={ownersFirstName}
                        name="ownersFirstName"
                        header="Owner's first name"
                        placeholder="First name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={ownersLastName}
                        name="ownersLastName"
                        header="Owner's last name"
                        placeholder="Last name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={ownersTelephoneNumber}
                        name="ownersTelephoneNumber"
                        header="Owner's telephone number"
                        placeholder="Telephone number"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={callOrigin}
                        name="callOrigin"
                        header='Call Origin'
                        placeholder='Select origin...'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={originOptions}
                    />
                </div>
                <div className='col-md-12'>
                    <Select
                        value={reasonForVisit}
                        name="reasonForVisit"
                        header='Reason(s) for visit'
                        placeholder='Select reason(s)...'
                        onChange={this.handleReasonMulti.bind(this)}
                        multi={true}
                        options={reasonOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={pghCode}
                        name="pghCode"
                        header='Code(s)'
                        placeholder='Select code(s)...'
                        onChange={this.handleCodeMulti.bind(this)}
                        multi={true}
                        options={codeOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={citationNumber}
                        name="citationNumber"
                        header="Citation number"
                        placeholder="Citation"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-12'>
                    <Textarea
                        value={comments}
                        name="comments"
                        header="Comments"
                        placeholder="Describe the incident"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={officerInitials}
                        name="officerInitials"
                        header='Officers involved'
                        placeholder='Select initials...'
                        onChange={this.handleInitialMulti.bind(this)}
                        multi={true}
                        options={initialsOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Input
                        value={note}
                        name="note"
                        header="Note"
                        placeholder="Quick reference"
                        maxLength={30}
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                {this.props.put != true &&
                    <div className='col-md-12'>
                        <Select
                            value={open}
                            name="open"
                            header='Keep open?'
                            placeholder='Yes or no...'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={openOptions}
                        />
                    </div>
                }
                {this.props.put == true &&
                    <div className='col-md-12 text-center'>
                        <button onClick={this.put.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.dropdowns
    }),
    ({
        ...Dropdowns.actionCreators
    })
)(Incident as any) as typeof Incident;