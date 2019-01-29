import * as React from 'react'
import * as constants from '../constants'
import Input from '../../formElements/input'
import Select from '../../formElements/select'
import Datepicker from '../../formElements/datepicker'

type props = {
    showFilters: boolean
    state: any
    setState: (stateObj: object) => void
}

export default class FilterInputs extends React.Component<props, {}> {

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
        } = this.props.state

        return (
            <div className="form-group">
                <div className='row'>
                    <div className='col-md-6'>
                        <Input
                            value={address}
                            name="address"
                            header=""
                            placeholder="Search address"
                            callback={e => this.props.setState({ address: e.target.value })}
                        />
                    </div>
                    <div className='col-md-6'>
                        <Select
                            value={status ? { value: status, label: status }: ''}
                            name="status"
                            header=''
                            placeholder='Flter by status'
                            onChange={status => this.props.setState({ status: status.value })}
                            multi={false}
                            options={constants.statuses}
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
                                    callback={date => this.props.setState({ date: date, clearDate: false })}
                                />
                            </div>
                            <div className='col-md-6'>
                                <Select
                                    value={reasonForVisit ? { value: reasonForVisit, label: reasonForVisit } : ''}
                                    name="reasonForVisit"
                                    header=''
                                    placeholder='Filter by reason'
                                    onChange={reasonForVisit => this.props.setState({ reasonForVisit: reasonForVisit.value })}
                                    multi={false}
                                    options={reasonOptions}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Select
                                    value={submittedBy ? { value: submittedBy, label: submittedBy } : ''}
                                    name="submittedBy"
                                    header=''
                                    placeholder='Filter by officer'
                                    onChange={submittedBy => this.props.setState({ submittedBy: submittedBy.value })}
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
                                    callback={e => this.props.setState({ note: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}