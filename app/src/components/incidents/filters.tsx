import * as React from 'react'
import Input from '../formElements/input'
import Select from '../formElements/select'
import Datepicker from '../formElements/datepicker'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as moment from 'moment'

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
    constructor(props) {
        super(props)
        this.state = {
            reasonOptions: loadingOptions,
            submittedByOptions: loadingOptions,
            address: '',
            status: '',
            submittedBy: '',
            date: '',
            clearDate: false,
            reasonForVisit: '',
            note: ''
        }
    }

    componentDidMount() {
        this.setSubmittedByDropdown()
        this.props.getDropdowns()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clearFilters == true) {
            this.setState({
                address: '',
                status: '',
                date: '',
                clearDate: true,
                submittedBy: '',
                reasonForVisit: '',
                note: ''
            })
        }
        var futureReason = [
            { value: '', label: 'All', name: 'reasonForVisit' }
        ]
        nextProps.dropdowns.reasonsForVisit.forEach(function (element) {
            var json = { "value": element.reason, "label": element.reason, "name": 'reasonForVisit' };
            futureReason.push(json)
        })
        this.setState({
            reasonOptions: futureReason
        })
    }

    setSubmittedByDropdown() {
        var futureSubmittedBy = [
            { value: '', label: 'All', name: 'submittedBy' }
        ]
        var electronicIncidents = this.props.incidents.filter(function (obj) {
            return obj.submittedBy != null
        })
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
        }, [])
    }

    handleChildDate(date) {
        this.setState({
            date: date,
            clearDate: false
        }, function (this) {
            this.filter()
        })
    }

    handleChildChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        }, function (this) {
            this.filter()
        })
    }

    handleChildSelect(event) {
        this.setState({
            [event.name]: event.value
        }, function (this) {
            this.filter()
        })
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
            clearDate,
            reasonForVisit,
            note
        } = this.state


        return (
            <div className="form-group">
                <div className='row'>
                    <div className='col-md-6'>
                        <Input
                            value={address}
                            name="address"
                            header=""
                            placeholder="Search address"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-6'>
                        <Select
                            value={status}
                            name="status"
                            header=''
                            placeholder='Flter by status'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={statuses}
                        />
                    </div>
                </div>
                {this.props.showFilters == true &&
                    <div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Datepicker
                                    value={date}
                                    clearDate={clearDate}
                                    name="date"
                                    header=""
                                    placeholder="Filter by date"
                                    callback={this.handleChildDate.bind(this)}
                                />
                            </div>
                            <div className='col-md-6'>
                                <Select
                                    value={reasonForVisit}
                                    name="reasonForVisit"
                                    header=''
                                    placeholder='Filter by reason'
                                    onChange={this.handleChildSelect.bind(this)}
                                    multi={false}
                                    options={reasonOptions}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Select
                                    value={submittedBy}
                                    name="submittedBy"
                                    header=''
                                    placeholder='Filter by officer'
                                    onChange={this.handleChildSelect.bind(this)}
                                    multi={false}
                                    options={submittedByOptions}
                                />
                            </div>
                            <div className='col-md-6'>
                                <Input
                                    value={note}
                                    name="note"
                                    header=""
                                    placeholder="Search notes"
                                    callback={this.handleChildChange.bind(this)}
                                />
                            </div>
                        </div>
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
)(Filters)