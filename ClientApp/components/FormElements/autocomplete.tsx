import * as React from 'react';

export default class autocomplete extends React.Component<any, any> {

    public render() {
        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <input className="form-control" name={this.props.name} id={this.props.name} placeholder={this.props.placeholder} onChange={this.props.callback.bind(this)}></input>
                </div>
            </div>
        )
    }
}
