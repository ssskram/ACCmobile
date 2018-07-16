import * as React from 'react';
import classNames from 'classnames'

export default class input extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            autoFocus: false
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
                    <input type='search'
                        maxLength={this.props.maxLength}
                        value={this.props.value}
                        className={conditionalClass}
                        name={this.props.name}
                        id={this.props.name}
                        placeholder={this.props.placeholder}
                        onChange={this.props.callback.bind(this)}></input>
                </div>
            </div>
        )
    }
}
