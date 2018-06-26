import * as React from 'react';
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Dropdowns from '../../store/dropdowns'

const statuses = [
    { value: '', label: 'All', name: 'status' },
    { value: 'Yes', label: 'Open', name: 'status' },
    { value: 'No', label: 'Closed', name: 'status' }
]

const loadingOptions = [{
    "value": '...loading...',
    "label": '...loading...'
}]
export class Filters extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            reasonOptions: loadingOptions,
            submittedByOptions: loadingOptions,
            address: '',
            status: '',
            submittedBy: '',
            date: '',
            reasonForVisit: '',
            note: ''
        }
    }

    componentDidMount() {
        this.setSubmittedByDropdown()
        this.props.getDropdowns()
    }

    setSubmittedByDropdown() {
        var futureSubmittedBy = [
            { value: '', label: 'All', name: 'submittedBy' }
        ]
        var electronicIncidents = this.props.incidents.filter(function (obj) {
            return obj.submittedBy != null
        });
        var uniqueSubmitters = this.getUniqueValuesOfKey(electronicIncidents, 'submittedBy')
        uniqueSubmitters.sort().forEach(element => {
            var json = { "value": element, "label": element, "name": 'submittedBy' };
            futureSubmittedBy.push(json)
        });
        this.setState({
            submittedByOptions: futureSubmittedBy
        })
    }
    getUniqueValuesOfKey(array, key) {
        return array.reduce(function (carry, item) {
            if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
            return carry;
        }, []);
    }

    componentWillReceiveProps() {
        var futureReason = [
            { value: '', label: 'All', name: 'reasonForVisit' }
        ]
        this.props.reasonsForVisit.forEach(function (element) {
            var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
            futureReason.push(json)
        })
        this.setState({
            reasonOptions: futureReason
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value }, function (this) {
            this.filter()
        });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value }, function (this) {
            this.filter()
        });
    }

    filter() {
        let self = this.state
        this.props.filter(self)
    }

    public render() {
        const {
            submittedByOptions,
            reasonOptions,
            address,
            status,
            submittedBy,
            date,
            reasonForVisit,
            note
        } = this.state
        
        return (
            <div className="form-group">
                <div className='row'>
                    <div className='col-md-4'>
                        <Input
                            value={address}
                            name="address"
                            header="Address"
                            placeholder="Search address"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-4'>
                        <Select
                            value={status}
                            name="status"
                            header='Status'
                            placeholder='Select status'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={statuses}
                        />
                    </div>
                    <div className='col-md-4'>
                        <Select
                            value={submittedBy}
                            name="submittedBy"
                            header='Submitted by'
                            placeholder='Select officer'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={submittedByOptions}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4'>
                        <Input
                            value={date}
                            name="date"
                            header="Date"
                            placeholder="Enter date"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-4'>
                        <Select
                            value={reasonForVisit}
                            name="reasonForVisit"
                            header='Reason for visit'
                            placeholder='Select reason'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={reasonOptions}
                        />
                    </div>
                    <div className='col-md-4'>
                        <Input
                            value={note}
                            name="note"
                            header="Note"
                            placeholder="Search notes"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
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
)(Filters as any) as typeof Filters;