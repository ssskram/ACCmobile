import * as React from 'react';
import classNames from 'classnames'
import DatePicker from 'react-datepicker';

export default class datepicker extends React.Component<any, any> {

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
                        selected={this.props.value}
                        name={this.props.name}
                        id={this.props.name}
                        placeholderText={this.props.placeholder}
                        onChange={this.props.callback.bind(this)}
                        className={conditionalClass}
                        calendarClassName="datepicker-calendar"
                    />
                </div>
            </div>
        )
    }
}
