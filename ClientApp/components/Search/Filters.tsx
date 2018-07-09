import * as React from 'react';
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Dropdowns from '../../store/dropdowns'
import classNames from 'classnames'

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
        
        var addressActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': address
        });

        var statusActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': status
        });

        var submittedByActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': submittedBy
        });

        var dateActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': date
        });

        var reasonForVisitActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': reasonForVisit
        });

        var noteActive = classNames({
            'col-md-4': true,
            'filter-container': true,
            'highlight-filter': note
        });
          
        return (
            <div className="form-group">
                <div className='row'>
                    <div className={addressActive}>
                        <Input
                            value={address}
                            name="address"
                            header="Address"
                            placeholder="Search address"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className={statusActive}>
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
                    <div className={submittedByActive}>
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
                    <div className={dateActive}>
                        <Input
                            value={date}
                            name="date"
                            header="Date"
                            placeholder="Enter date"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className={reasonForVisitActive}>
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
                    <div className={noteActive}>
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