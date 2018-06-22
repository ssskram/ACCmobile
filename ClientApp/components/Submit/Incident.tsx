import * as React from 'react';
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import Textarea from '../FormElements/textarea'

export default class Incident extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
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

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    public render() {
        // state
        const {
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
                    />
                </div>
                <div className='col-md-12'>
                    <Select
                        value={reasonForVisit}
                        name="reasonForVisit"
                        header='Reason(s) for visit'
                        placeholder='Select reason(s)...'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={true}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={pghCode}
                        name="pghCode"
                        header='Code(s)'
                        placeholder='Select code(s)...'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={true}
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
                        onChange={this.handleChildSelect.bind(this)}
                        multi={true}
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