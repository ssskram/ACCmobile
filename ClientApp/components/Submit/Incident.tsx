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
            open: ''
        }
    }

    componentDidMount() {
        this.props.getDropdowns()
    }

    componentWillReceiveProps() {
        var futureOrigin: any[] = []
        var futureReason: any[] = []
        var futureCode: any[] = []
        var futureInitials: any[] = []
        this.props.callOrigins.forEach(function (element) {
            var json = { "value": element.origin, "label": element.origin, "name": 'callOrigin' };
            futureOrigin.push(json)
        })
        this.props.reasonsForVisit.forEach(function (element) {
            var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
            futureReason.push(json)
        })
        this.props.citationNumbers.forEach(function (element) {
            var json = { "value": element.citation, "label": element.citation, "name": 'citationNumber' };
            futureCode.push(json)
        })
        this.props.officerInitials.forEach(function (element) {
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

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleOriginMulti(value) {
        this.setState({ callOrigin: value })
    };

    handleReasonMulti(value) {
        this.setState({ reasonForVisit: value })
    };

    handleCodeMulti(value) {
        this.setState({ pghCode: value })
    };

    handleInitialMulti(value) {
        this.setState({ officerInitials: value })
    };


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
                        onChange={this.handleOriginMulti.bind(this)}
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
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
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