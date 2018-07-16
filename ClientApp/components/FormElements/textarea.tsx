import * as React from 'react';
import classNames from 'classnames'

export default class textarea extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            height: '100px'
        }
    }

    setHeight(element) {
        let newHeight = element.target.scrollHeight
        if (newHeight > 98) {
            this.setState({
                height: newHeight + 'px'
            })
        }
        if (element.target.value == '') {
            this.setState({
                height: '100px'
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
                    <textarea
                        onKeyUp={this.setHeight.bind(this)}
                        onFocus={this.setHeight.bind(this)}
                        value={this.props.value}
                        className={conditionalClass}
                        name={this.props.name}
                        id={this.props.name}
                        placeholder={this.props.placeholder}
                        style={{ height: this.state.height }}
                        onChange={this.props.callback.bind(this)}></textarea>
                </div>
            </div>
        )
    }
}