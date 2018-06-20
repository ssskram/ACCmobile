import * as React from 'react';

const margin = {
    marginTop: '25px',
    marginRight: '10px',
    marginLeft: '10px'
}

export default class Messages extends React.Component<any, {}> {

    createMarkup() {
        return { __html: this.props.messages };
    }

    public render() {
        return (
            this.props.messages ? (
                <div style={margin} role="alert" className="alert alert-success">
                    <h3 className="message-body" dangerouslySetInnerHTML={this.createMarkup()}></h3>
                </div>
            ) : null
        )
    }
}
