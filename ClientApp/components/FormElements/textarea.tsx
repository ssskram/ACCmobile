import * as React from 'react';
import classNames from 'classnames'

export default class textarea extends React.Component<any, any> {

    public render() {

        var conditionalClass = classNames({
            'form-control': true,
            'highlight-filter': this.props.value
        });
        
        return (
        <div className="form-group">
            <div className="col-md-12 form-element">
                <h4 className="form-h4">{this.props.header}</h4>
                <textarea value={this.props.value} className={conditionalClass} name={this.props.name} id={this.props.name} placeholder={this.props.placeholder} rows={4} onChange={this.props.callback.bind(this)}></textarea>
            </div>
        </div>
        )
    }
}