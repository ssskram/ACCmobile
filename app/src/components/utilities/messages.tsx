import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as MessageStore from '../../store/messages'

export class Messages extends React.Component<any, {}> {

    createMarkup() {
        return { __html: this.props.message };
    }

    clearMessage() { 
        this.props.clearMessage()
    }

    public render() {
        return (
            this.props.message ? (
                <div className="alert alert-success">
                    <button className="close" onClick={this.clearMessage.bind(this)} style={{ marginTop: '-15px', marginRight: '-5px', fontSize: '2em' }}>
                        <span>&times;</span>
                    </button>
                    <h3 dangerouslySetInnerHTML={this.createMarkup()}></h3>
                </div >
            ) : null
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages
    }),
    ({
        ...MessageStore.actionCreators,
    })
)(Messages)
