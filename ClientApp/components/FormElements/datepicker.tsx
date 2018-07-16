import * as React from 'react';
import classNames from 'classnames'
import DatePicker from 'react-datepicker';
import * as moment from 'moment'

export default class datepicker extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            date: null,
        }
    }

    componentDidMount() {
        if (this.props.value) {
            this.setState({
                date: moment(this.props.value)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({
                date: moment(nextProps.value)
            })
        }
        if (nextProps.clearDate == true) { 
            this.setState({
                date: null
            })
        }

    }

    public render() {

        var conditionalClass = classNames({
            'form-control': true,
            'highlight-filter': this.props.value
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}</h4>
                    <DatePicker
                        selected={this.state.date}
                        name={this.props.name}
                        id={this.props.name}
                        placeholderText={this.props.placeholder}
                        onChange={this.props.callback.bind(this)}
                        className={conditionalClass}
                        calendarClassName="datepicker-calendar"
                        showMonthDropdown
                        showYearDropdown
                    />
                </div>
            </div>
        )
    }
}
